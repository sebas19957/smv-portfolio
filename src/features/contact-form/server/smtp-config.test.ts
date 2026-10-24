import { describe, expect, it } from 'vitest';
import { readSmtpConfig } from './smtp-config';

const env = { EMAIL_USER: 'bot@test', EMAIL_PASS: 'pw', EMAIL_RECEIVER: 'owner@test' };

describe('readSmtpConfig', () => {
  it('defaults to Gmail on 587 and leaves the sender to the mailer fallback', () => {
    expect(readSmtpConfig(env)).toEqual({
      host: 'smtp.gmail.com',
      port: 587,
      user: 'bot@test',
      pass: 'pw',
      from: undefined,
      receiver: 'owner@test',
    });
  });

  it('treats empty values (e.g. `EMAIL_PORT=` in an env file) as unset', () => {
    expect(readSmtpConfig({ ...env, EMAIL_HOST: '', EMAIL_PORT: '', EMAIL_FROM: '' })).toMatchObject({
      host: 'smtp.gmail.com',
      port: 587,
      from: undefined,
    });
  });

  it('uses the configured host, port and sender', () => {
    expect(
      readSmtpConfig({ ...env, EMAIL_HOST: 'mail.example.com', EMAIL_PORT: '465', EMAIL_FROM: 'Bot <bot@test>' }),
    ).toMatchObject({ host: 'mail.example.com', port: 465, from: 'Bot <bot@test>' });
  });

  it('falls back to 587 for a non-numeric port', () => {
    expect(readSmtpConfig({ ...env, EMAIL_PORT: 'smtp' }).port).toBe(587);
  });

  it('names every missing credential without exposing values', () => {
    expect(() => readSmtpConfig({ EMAIL_PASS: 'pw', EMAIL_RECEIVER: '' })).toThrow(
      'Missing SMTP environment variables: EMAIL_USER, EMAIL_RECEIVER',
    );
  });
});
