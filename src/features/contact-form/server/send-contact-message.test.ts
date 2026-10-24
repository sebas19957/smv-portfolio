import { describe, expect, it, vi } from 'vitest';
import { fakeRateLimitStore } from './fake-rate-limit-store';
import type { Mailer, OutgoingMail } from './mailer';
import { createRedisRateLimiter, type RateLimiter, type RateLimitStatus } from './rate-limiter';
import { sendContactMessage } from './send-contact-message';

const message = { name: 'Ada <Lovelace>', email: 'ada@example.com', message: 'Hello there, nice work!' };
const IP = '203.0.113.7';

function setup({ status = { allowed: true } as RateLimitStatus, sendError = null as Error | null } = {}) {
  const sent: OutgoingMail[] = [];
  const mailer: Mailer = {
    send: vi.fn(async (mail: OutgoingMail) => {
      if (sendError) throw sendError;
      sent.push(mail);
    }),
  };
  const limiter = { reserve: vi.fn(async () => status), release: vi.fn(async () => {}) } satisfies RateLimiter;
  const logger = { error: vi.fn() };
  return { sent, mailer, limiter, logger, deps: { mailer, limiter, logger } };
}

describe('sendContactMessage', () => {
  it('emails the owner and keeps the reservation', async () => {
    const { sent, limiter, logger, deps } = setup();
    await expect(sendContactMessage(message, IP, deps)).resolves.toEqual({ status: 'sent' });

    expect(limiter.reserve).toHaveBeenCalledWith(IP);
    expect(sent).toHaveLength(1);
    expect(sent[0].subject).toBe('📬 New message from Ada <Lovelace> - Portfolio SMV');
    expect(sent[0].replyTo).toBe('ada@example.com');
    expect(sent[0].html).toContain('Ada &lt;Lovelace&gt;');
    expect(sent[0].html).toContain(IP);
    expect(limiter.release).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('strips line breaks from the name in the subject', async () => {
    const { sent, deps } = setup();
    await sendContactMessage({ ...message, name: 'Ada\r\nBcc: evil@example.com' }, IP, deps);
    expect(sent[0].subject).toBe('📬 New message from Ada Bcc: evil@example.com - Portfolio SMV');
  });

  it('refuses without sending when the reservation is rejected', async () => {
    const { mailer, limiter, deps } = setup({ status: { allowed: false, hoursRemaining: 5 } });
    await expect(sendContactMessage(message, IP, deps)).resolves.toEqual({ status: 'rate-limited', hoursRemaining: 5 });
    expect(mailer.send).not.toHaveBeenCalled();
    expect(limiter.release).not.toHaveBeenCalled();
  });

  it('releases the reservation when the email cannot be sent, so failures do not count', async () => {
    const error = new Error('SMTP down');
    const { limiter, logger, deps } = setup({ sendError: error });
    await expect(sendContactMessage(message, IP, deps)).resolves.toEqual({ status: 'failed' });
    expect(limiter.release).toHaveBeenCalledWith(IP);
    expect(logger.error).toHaveBeenCalledWith(expect.any(String), error);
  });

  it('still reports the failure when the reservation cannot be released', async () => {
    const { limiter, logger, deps } = setup({ sendError: new Error('SMTP down') });
    limiter.release.mockRejectedValueOnce(new Error('ECONNRESET'));
    await expect(sendContactMessage(message, IP, deps)).resolves.toEqual({ status: 'failed' });
    expect(logger.error).toHaveBeenCalledTimes(2);
  });

  it('fails open when Redis is unavailable: logs, still sends and has nothing to release', async () => {
    const { sent, limiter, logger, deps } = setup();
    limiter.reserve.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    await expect(sendContactMessage(message, IP, deps)).resolves.toEqual({ status: 'sent' });
    expect(sent).toHaveLength(1);
    expect(logger.error).toHaveBeenCalledTimes(1);

    limiter.reserve.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    vi.mocked(deps.mailer.send).mockRejectedValueOnce(new Error('SMTP down'));
    await expect(sendContactMessage(message, IP, deps)).resolves.toEqual({ status: 'failed' });
    expect(limiter.release).not.toHaveBeenCalled();
  });

  it('sends at most the limit when one IP fires many requests at once', async () => {
    const { store } = fakeRateLimitStore();
    const { sent, deps } = setup();
    vi.mocked(deps.mailer.send).mockImplementation(async (mail) => {
      await new Promise((resolve) => setTimeout(resolve, 5));
      sent.push(mail);
    });
    const concurrent = { ...deps, limiter: createRedisRateLimiter(() => store) };

    const outcomes = await Promise.all(Array.from({ length: 10 }, () => sendContactMessage(message, IP, concurrent)));
    expect(outcomes.filter((outcome) => outcome.status === 'sent')).toHaveLength(3);
    expect(outcomes.filter((outcome) => outcome.status === 'rate-limited')).toHaveLength(7);
    expect(sent).toHaveLength(3);
  });
});
