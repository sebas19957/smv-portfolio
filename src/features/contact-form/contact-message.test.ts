import { describe, expect, it } from 'vitest';
import { MAX_LENGTH, isFieldValid, parseContactMessage } from './contact-message';

const valid = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello there, nice portfolio!' };

describe('isFieldValid', () => {
  it('requires a trimmed name of at least 3 characters', () => {
    expect(isFieldValid('name', '  Al  ')).toBe(false);
    expect(isFieldValid('name', 'Ada')).toBe(true);
  });

  it('requires a well-formed email', () => {
    expect(isFieldValid('email', 'ada@example')).toBe(false);
    expect(isFieldValid('email', 'ada example@x.com')).toBe(false);
    expect(isFieldValid('email', ' ada@example.com ')).toBe(true);
  });

  it('requires a trimmed message of at least 10 characters', () => {
    expect(isFieldValid('message', '   short   ')).toBe(false);
    expect(isFieldValid('message', 'long enough')).toBe(true);
  });

  it('rejects values above the maximum length', () => {
    expect(isFieldValid('name', 'a'.repeat(MAX_LENGTH.name + 1))).toBe(false);
    expect(isFieldValid('email', `${'a'.repeat(MAX_LENGTH.email)}@x.co`)).toBe(false);
    expect(isFieldValid('message', 'a'.repeat(MAX_LENGTH.message + 1))).toBe(false);
    expect(isFieldValid('message', 'a'.repeat(MAX_LENGTH.message))).toBe(true);
  });
});

describe('parseContactMessage', () => {
  it('returns the trimmed message when every field is valid', () => {
    const result = parseContactMessage({ name: ' Ada Lovelace ', email: ' ada@example.com', message: valid.message });
    expect(result).toEqual({ ok: true, value: valid });
  });

  it('lists every invalid field', () => {
    const result = parseContactMessage({ name: 'Al', email: 'nope', message: valid.message });
    expect(result).toEqual({ ok: false, fields: ['name', 'email'] });
  });

  it('treats missing or non-string fields as invalid', () => {
    expect(parseContactMessage({ name: 42, email: valid.email })).toEqual({ ok: false, fields: ['name', 'message'] });
  });

  it('rejects bodies that are not objects', () => {
    for (const body of [null, 'text', 3, ['a']]) {
      expect(parseContactMessage(body)).toEqual({ ok: false, fields: ['name', 'email', 'message'] });
    }
  });
});
