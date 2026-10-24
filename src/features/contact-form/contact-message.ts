export type FieldName = 'name' | 'email' | 'message';

export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

export type ParseResult =
  | { readonly ok: true; readonly value: ContactMessage }
  | { readonly ok: false; readonly fields: FieldName[] };

/** JSON bodies returned by `POST /api/send-email`, shared by the route and the browser controller. */
export type ContactApiResponse =
  | { readonly ok: true }
  | { readonly error: 'invalid-body' | 'payload-too-large' | 'send-failed' }
  | { readonly error: 'validation'; readonly fields: FieldName[] }
  | { readonly error: 'rate-limited'; readonly hoursRemaining: number };

/** Messages allowed per client IP per window, enforced by the API; the window is also the form's fallback. */
export const RATE_LIMIT = { messages: 3, windowHours: 24 } as const;

export const FIELDS: ReadonlyArray<FieldName> = ['name', 'email', 'message'];

export const MIN_LENGTH = { name: 3, message: 10 } as const;

/** Upper bounds (trimmed) mirrored by the inputs' `maxlength`, so they only bite on crafted requests. */
export const MAX_LENGTH: Record<FieldName, number> = { name: 100, email: 254, message: 5000 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RULES: Record<FieldName, (value: string) => boolean> = {
  name: (value) => value.length >= MIN_LENGTH.name,
  email: (value) => EMAIL.test(value),
  message: (value) => value.length >= MIN_LENGTH.message,
};

/** Validation shared by the browser controller and the API route. */
export function isFieldValid(name: FieldName, raw: string): boolean {
  const value = raw.trim();
  return value.length <= MAX_LENGTH[name] && RULES[name](value);
}

/** Narrows an untrusted request body into a trimmed message, or lists the invalid fields. */
export function parseContactMessage(body: unknown): ParseResult {
  const record = typeof body === 'object' && body !== null && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  const read = (name: FieldName) => (typeof record[name] === 'string' ? (record[name] as string) : '');
  const fields = FIELDS.filter((name) => !isFieldValid(name, read(name)));
  if (fields.length) return { ok: false, fields };
  return { ok: true, value: { name: read('name').trim(), email: read('email').trim(), message: read('message').trim() } };
}
