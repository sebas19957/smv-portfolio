import { parseContactMessage, type ContactApiResponse } from '../contact-message';
import { getClientIp } from './client-ip';
import { sendContactMessage, type SendContactDeps } from './send-contact-message';

/** Bodies above this are rejected before parsing; a maxed-out valid message is ~5.5 KB. */
const MAX_BODY_BYTES = 16 * 1024;

const json = (body: ContactApiResponse, status: number, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers });

async function readJson(request: Request): Promise<{ ok: true; body: unknown } | { ok: false }> {
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return { ok: false };
    return { ok: true, body: JSON.parse(text) };
  } catch {
    return { ok: false };
  }
}

/** HTTP mapping of the contact use case: 400 bad input, 429 limited, 500 send failure, 200 sent. */
export async function handleSendEmail(request: Request, deps: SendContactDeps): Promise<Response> {
  const read = await readJson(request);
  if (!read.ok) return json({ error: 'invalid-body' }, 400);

  const parsed = parseContactMessage(read.body);
  if (!parsed.ok) return json({ error: 'validation', fields: parsed.fields }, 400);

  const outcome = await sendContactMessage(parsed.value, getClientIp(request.headers), deps);
  switch (outcome.status) {
    case 'sent':
      return json({ ok: true }, 200);
    case 'rate-limited':
      return json({ error: 'rate-limited', hoursRemaining: outcome.hoursRemaining }, 429, {
        'Retry-After': String(outcome.hoursRemaining * 3600),
      });
    case 'failed':
      return json({ error: 'send-failed' }, 500);
  }
}
