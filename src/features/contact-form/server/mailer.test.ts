import { describe, expect, it, vi } from 'vitest';
import { createSmtpMailer, type SmtpConfig } from './mailer';

const config: SmtpConfig = { host: 'smtp.test', port: 587, user: 'bot@test', pass: 'pw', receiver: 'owner@test' };
const mail = { subject: 'Hi', html: '<p>Hi</p>', replyTo: 'ada@example.com' };

function transportSpy() {
  const sendMail = vi.fn(async () => ({}));
  const createTransport = vi.fn(() => ({ sendMail }));
  return { sendMail, createTransport };
}

describe('createSmtpMailer', () => {
  it('uses STARTTLS on 587 and falls back to the SMTP user as sender', async () => {
    const { sendMail, createTransport } = transportSpy();
    await createSmtpMailer(() => config, createTransport).send(mail);

    expect(createTransport).toHaveBeenCalledWith({
      host: 'smtp.test',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: 'bot@test', pass: 'pw' },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
    expect(sendMail).toHaveBeenCalledWith({ from: 'bot@test', to: 'owner@test', ...mail });
  });

  it('uses implicit TLS on 465 and an explicit sender when configured', async () => {
    const { sendMail, createTransport } = transportSpy();
    await createSmtpMailer(() => ({ ...config, port: 465, from: 'Portfolio <no-reply@test>' }), createTransport).send(mail);

    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({ port: 465, secure: true, requireTLS: false }));
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ from: 'Portfolio <no-reply@test>' }));
  });

  it('builds the transport once and reads the config lazily', async () => {
    const { createTransport } = transportSpy();
    const getConfig = vi.fn(() => config);
    const mailer = createSmtpMailer(getConfig, createTransport);
    expect(getConfig).not.toHaveBeenCalled();

    await mailer.send(mail);
    await mailer.send(mail);
    expect(createTransport).toHaveBeenCalledTimes(1);
  });

  it('rejects when the configuration is unavailable', async () => {
    const mailer = createSmtpMailer(() => {
      throw new Error('EMAIL_USER is not set');
    });
    await expect(mailer.send(mail)).rejects.toThrow('EMAIL_USER is not set');
  });
});
