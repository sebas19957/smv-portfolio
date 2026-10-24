import nodemailer from 'nodemailer';

export interface OutgoingMail {
  readonly subject: string;
  readonly html: string;
  readonly replyTo: string;
}

export interface Mailer {
  send(mail: OutgoingMail): Promise<void>;
}

export interface SmtpConfig {
  readonly host: string;
  readonly port: number;
  readonly user: string;
  readonly pass: string;
  /** Sender address; falls back to `user`. */
  readonly from?: string;
  readonly receiver: string;
}

type SmtpTransport = { sendMail(options: OutgoingMail & { from: string; to: string }): Promise<unknown> };
type TransportFactory = (options: {
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  auth: { user: string; pass: string };
  connectionTimeout: number;
  greetingTimeout: number;
  socketTimeout: number;
}) => SmtpTransport;

/** Bounds every SMTP phase so a slow or tarpitted host fails the request in seconds, not minutes. */
const TIMEOUTS = { connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000 } as const;

/**
 * Nodemailer SMTP mailer. Hetzner blocks outbound 465 by default, so 587 with STARTTLS is the
 * expected setup; `secure` (implicit TLS) is only used on 465. Config and transport are resolved
 * on the first send, never at import time.
 */
export function createSmtpMailer(
  getConfig: () => SmtpConfig,
  createTransport: TransportFactory = (options) => nodemailer.createTransport(options),
): Mailer {
  let cached: { transport: SmtpTransport; from: string; to: string } | null = null;

  const resolve = () => {
    if (cached) return cached;
    const { host, port, user, pass, from, receiver } = getConfig();
    const transport = createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user, pass },
      ...TIMEOUTS,
    });
    cached = { transport, from: from || user, to: receiver };
    return cached;
  };

  return {
    async send(mail) {
      const { transport, from, to } = resolve();
      await transport.sendMail({ from, to, ...mail });
    },
  };
}
