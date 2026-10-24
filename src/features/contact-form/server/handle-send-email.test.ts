import { describe, expect, it, vi } from 'vitest';
import { handleSendEmail } from './handle-send-email';
import type { RateLimitStatus } from './rate-limiter';

const body = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello there, nice work!' };

function setup({ status = { allowed: true } as RateLimitStatus, sendError = null as Error | null } = {}) {
  const mailer = {
    send: vi.fn(async () => {
      if (sendError) throw sendError;
    }),
  };
  const limiter = { check: vi.fn(async () => status), record: vi.fn(async () => {}) };
  const logger = { error: vi.fn() };
  return { mailer, limiter, logger, deps: { mailer, limiter, logger } };
}

const post = (payload: unknown, headers: Record<string, string> = {}) =>
  new Request('http://localhost/api/send-email', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
  });

describe('handleSendEmail', () => {
  it('returns 400 for a body that is not JSON', async () => {
    const { mailer, deps } = setup();
    const response = await handleSendEmail(post('{not json'), deps);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid-body' });
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it('returns 400 for an oversized body', async () => {
    const { mailer, deps } = setup();
    const response = await handleSendEmail(post({ ...body, message: 'x'.repeat(50_000) }), deps);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid-body' });
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it('returns 400 with the invalid field names', async () => {
    const { mailer, deps } = setup();
    const response = await handleSendEmail(post({ name: 'Al', email: body.email }), deps);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'validation', fields: ['name', 'message'] });
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it('returns 200 after sending, rate limiting by the Cloudflare client IP', async () => {
    const { mailer, limiter, deps } = setup();
    const response = await handleSendEmail(post(body, { 'cf-connecting-ip': '203.0.113.7' }), deps);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual({ ok: true });
    expect(mailer.send).toHaveBeenCalledOnce();
    expect(limiter.check).toHaveBeenCalledWith('203.0.113.7');
    expect(limiter.record).toHaveBeenCalledWith('203.0.113.7');
  });

  it('returns 429 with the hours remaining when the limit is reached', async () => {
    const { deps } = setup({ status: { allowed: false, hoursRemaining: 4 } });
    const response = await handleSendEmail(post(body), deps);
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe(String(4 * 3600));
    expect(await response.json()).toEqual({ error: 'rate-limited', hoursRemaining: 4 });
  });

  it('returns a generic 500 without leaking the underlying error', async () => {
    const { logger, deps } = setup({ sendError: new Error('535 auth failed for secret-user') });
    const response = await handleSendEmail(post(body), deps);
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(JSON.parse(text)).toEqual({ error: 'send-failed' });
    expect(text).not.toContain('secret-user');
    expect(logger.error).toHaveBeenCalled();
  });
});
