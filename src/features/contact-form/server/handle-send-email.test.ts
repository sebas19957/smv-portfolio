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
  const limiter = { reserve: vi.fn(async () => status), release: vi.fn(async () => {}) };
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

  it('returns 413 without reading the body when Content-Length is over the limit', async () => {
    const { mailer, deps } = setup();
    const request = post(body, { 'content-length': String(64 * 1024) });
    const response = await handleSendEmail(request, deps);
    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: 'payload-too-large' });
    expect(request.bodyUsed).toBe(false);
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it('returns 413 for an oversized body', async () => {
    const { mailer, deps } = setup();
    const response = await handleSendEmail(post({ ...body, message: 'x'.repeat(50_000) }), deps);
    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: 'payload-too-large' });
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it('stops reading a chunked body (no Content-Length) as soon as it passes the limit', async () => {
    const { mailer, deps } = setup();
    let pulled = 0;
    const endless = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled++;
        controller.enqueue(new Uint8Array(1024).fill(120));
      },
    });
    const request = new Request('http://localhost/api/send-email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: endless,
      duplex: 'half',
    } as RequestInit);

    const response = await handleSendEmail(request, deps);
    expect(response.status).toBe(413);
    expect(pulled).toBeLessThan(32);
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it('returns 413 when the server aborts the body stream (adapter body size limit)', async () => {
    const { mailer, deps } = setup();
    const aborted = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.error(new Error('Body size limit exceeded: received more than 65536 bytes'));
      },
    });
    const request = new Request('http://localhost/api/send-email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: aborted,
      duplex: 'half',
    } as RequestInit);

    const response = await handleSendEmail(request, deps);
    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: 'payload-too-large' });
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it('measures the limit in bytes, not characters', async () => {
    const { deps } = setup();
    // 6,000 four-byte emoji: under the limit in UTF-16 code units, ~24 KB on the wire.
    const response = await handleSendEmail(post({ ...body, message: '📬'.repeat(6_000) }), deps);
    expect(response.status).toBe(413);
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
    expect(limiter.reserve).toHaveBeenCalledWith('203.0.113.7');
    expect(limiter.release).not.toHaveBeenCalled();
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
