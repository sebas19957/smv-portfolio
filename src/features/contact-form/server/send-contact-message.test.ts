import { describe, expect, it, vi } from 'vitest';
import type { Mailer, OutgoingMail } from './mailer';
import type { RateLimiter, RateLimitStatus } from './rate-limiter';
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
  const limiter = { check: vi.fn(async () => status), record: vi.fn(async () => {}) } satisfies RateLimiter;
  const logger = { error: vi.fn() };
  return { sent, mailer, limiter, logger, deps: { mailer, limiter, logger } };
}

describe('sendContactMessage', () => {
  it('emails the owner and counts the attempt', async () => {
    const { sent, limiter, logger, deps } = setup();
    await expect(sendContactMessage(message, IP, deps)).resolves.toEqual({ status: 'sent' });

    expect(limiter.check).toHaveBeenCalledWith(IP);
    expect(sent).toHaveLength(1);
    expect(sent[0].subject).toBe('📬 New message from Ada <Lovelace> - Portfolio SMV');
    expect(sent[0].replyTo).toBe('ada@example.com');
    expect(sent[0].html).toContain('Ada &lt;Lovelace&gt;');
    expect(sent[0].html).toContain(IP);
    expect(limiter.record).toHaveBeenCalledWith(IP);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('strips line breaks from the name in the subject', async () => {
    const { sent, deps } = setup();
    await sendContactMessage({ ...message, name: 'Ada\r\nBcc: evil@example.com' }, IP, deps);
    expect(sent[0].subject).toBe('📬 New message from Ada Bcc: evil@example.com - Portfolio SMV');
  });

  it('refuses without sending when the limit is reached', async () => {
    const { mailer, limiter, deps } = setup({ status: { allowed: false, hoursRemaining: 5 } });
    await expect(sendContactMessage(message, IP, deps)).resolves.toEqual({ status: 'rate-limited', hoursRemaining: 5 });
    expect(mailer.send).not.toHaveBeenCalled();
    expect(limiter.record).not.toHaveBeenCalled();
  });

  it('reports a failure without counting the attempt when the email cannot be sent', async () => {
    const error = new Error('SMTP down');
    const { limiter, logger, deps } = setup({ sendError: error });
    await expect(sendContactMessage(message, IP, deps)).resolves.toEqual({ status: 'failed' });
    expect(limiter.record).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(expect.any(String), error);
  });

  it('fails open when Redis is unavailable: logs and still sends', async () => {
    const { sent, limiter, logger, deps } = setup();
    limiter.check.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    limiter.record.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    await expect(sendContactMessage(message, IP, deps)).resolves.toEqual({ status: 'sent' });
    expect(sent).toHaveLength(1);
    expect(logger.error).toHaveBeenCalledTimes(2);
  });
});
