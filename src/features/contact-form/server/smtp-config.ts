import type { SmtpConfig } from './mailer';

export type SmtpEnv = Partial<
  Record<'EMAIL_HOST' | 'EMAIL_PORT' | 'EMAIL_USER' | 'EMAIL_PASS' | 'EMAIL_FROM' | 'EMAIL_RECEIVER', string>
>;

const REQUIRED = ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_RECEIVER'] as const;

/**
 * SMTP settings from raw environment values. Empty strings count as unset (env files often carry
 * `KEY=`), so host and port fall back to Gmail on 587; missing credentials throw by name only.
 */
export function readSmtpConfig(env: SmtpEnv): SmtpConfig {
  const missing = REQUIRED.filter((name) => !env[name]);
  if (missing.length) throw new Error(`Missing SMTP environment variables: ${missing.join(', ')}`);
  return {
    host: env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(env.EMAIL_PORT) || 587,
    user: env.EMAIL_USER!,
    pass: env.EMAIL_PASS!,
    from: env.EMAIL_FROM || undefined,
    receiver: env.EMAIL_RECEIVER!,
  };
}
