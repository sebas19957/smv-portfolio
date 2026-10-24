import { parseContactMessage, type ContactApiResponse } from '../contact-message';
import { getClientIp } from './client-ip';
import { sendContactMessage, type SendContactDeps } from './send-contact-message';

/** Larger bodies get a 413; a maxed-out valid message is ~5.5 KB. */
const MAX_BODY_BYTES = 16 * 1024;

const json = (body: ContactApiResponse, status: number, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers });

type ReadResult = { ok: true; body: unknown } | { ok: false; error: 'invalid-body' | 'payload-too-large' };

/**
 * Streams the body, counting bytes as they arrive, so a chunked request without Content-Length
 * is cut off at the limit instead of being buffered whole. Returns `null` when it is too large.
 */
async function readText(body: ReadableStream<Uint8Array> | null): Promise<string | null> {
  if (!body) return '';
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let size = 0;
  try {
    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
      size += chunk.value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => {});
        return null;
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
  } catch {
    // The Node adapter errors the stream once a body passes its own `bodySizeLimit`, and the
    // runtime may read ahead of us, so that can happen before our count reaches the limit.
    // (A client that disconnected mid-body never sees the response either way.)
    return null;
  }
  return text + decoder.decode();
}

async function readJson(request: Request): Promise<ReadResult> {
  const text = await readText(request.body);
  if (text === null) return { ok: false, error: 'payload-too-large' };
  try {
    return { ok: true, body: JSON.parse(text) };
  } catch {
    return { ok: false, error: 'invalid-body' };
  }
}

/**
 * HTTP mapping of the contact use case: 413 too large, 400 bad input, 429 limited, 500 send
 * failure, 200 sent. A declared Content-Length over the limit is refused before reading anything.
 */
export async function handleSendEmail(request: Request, deps: SendContactDeps): Promise<Response> {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    return json({ error: 'payload-too-large' }, 413);
  }

  const read = await readJson(request);
  if (!read.ok) return json({ error: read.error }, read.error === 'payload-too-large' ? 413 : 400);

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
