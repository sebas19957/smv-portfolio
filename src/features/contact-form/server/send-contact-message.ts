import type { ContactMessage } from '../contact-message';
import { generateContactEmailTemplate } from './email-template';
import type { Mailer } from './mailer';
import type { RateLimiter, RateLimitStatus } from './rate-limiter';

export interface Logger {
  error(message: string, error?: unknown): void;
}

export interface SendContactDeps {
  readonly mailer: Mailer;
  readonly limiter: RateLimiter;
  readonly logger: Logger;
}

export type SendOutcome =
  | { readonly status: 'sent' }
  | { readonly status: 'rate-limited'; readonly hoursRemaining: number }
  | { readonly status: 'failed' };

/**
 * Sends one contact message to the portfolio owner, enforcing the per-IP limit. The attempt is
 * reserved before sending and released if the send fails, so only successful sends count. Redis
 * problems fail open (logged, message still sent): losing a real message is worse than brief spam
 * exposure.
 */
export async function sendContactMessage(
  message: ContactMessage,
  ip: string,
  { mailer, limiter, logger }: SendContactDeps,
): Promise<SendOutcome> {
  let status: RateLimitStatus = { allowed: true };
  let reserved = false;
  try {
    status = await limiter.reserve(ip);
    reserved = status.allowed;
  } catch (error) {
    logger.error('[contact] rate limit check failed, continuing without it', error);
  }
  if (!status.allowed) return { status: 'rate-limited', hoursRemaining: status.hoursRemaining };

  try {
    await mailer.send({
      subject: `📬 New message from ${message.name.replace(/[\r\n]+/g, ' ')} - Portfolio SMV`,
      html: generateContactEmailTemplate({ ...message, ip }),
      replyTo: message.email,
    });
  } catch (error) {
    logger.error('[contact] email delivery failed', error);
    if (reserved) {
      try {
        await limiter.release(ip);
      } catch (releaseError) {
        logger.error('[contact] could not release the attempt', releaseError);
      }
    }
    return { status: 'failed' };
  }

  return { status: 'sent' };
}
