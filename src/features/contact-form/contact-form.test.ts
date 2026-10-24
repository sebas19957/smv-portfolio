// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initContactForm } from './contact-form';

const COPY = {
  success: 'Message sent.',
  rateLimited: 'Limit reached. Try again in {hours} h.',
  error: 'Could not send.',
};

function mount() {
  document.body.innerHTML = `
    <form data-contact-form data-sending-label="Sending...">
      <input name="name" aria-invalid="false" /><span data-field-error="name" hidden>name error</span>
      <input name="email" /><span data-field-error="email" hidden>email error</span>
      <textarea name="message"></textarea><span data-field-error="message" hidden>message error</span>
      <button type="submit" data-contact-submit><span class="btn__label">Send Message</span></button>
      <p aria-live="polite" data-form-status data-success="${COPY.success}"
         data-rate-limited="${COPY.rateLimited}" data-error="${COPY.error}"></p>
    </form>`;
  const form = document.querySelector<HTMLFormElement>('form')!;
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
  return {
    form,
    field,
    button: form.querySelector<HTMLButtonElement>('button')!,
    label: form.querySelector<HTMLElement>('.btn__label')!,
    status: form.querySelector<HTMLElement>('[data-form-status]')!,
    error: (name: string) => form.querySelector<HTMLElement>(`[data-field-error="${name}"]`)!,
    fill(values = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello there, nice work!' }) {
      for (const [name, value] of Object.entries(values)) field(name).value = value;
    },
    submit: () => form.dispatchEvent(new Event('submit', { cancelable: true })),
  };
}

const respond = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

let fetchMock: ReturnType<typeof vi.fn>;
let dispose: () => void;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  dispose?.();
  vi.unstubAllGlobals();
});

describe('initContactForm', () => {
  it('shows the inline errors, focuses the first invalid field and does not submit', () => {
    const ui = mount();
    dispose = initContactForm();
    ui.fill({ name: 'Al', email: 'ada@example.com', message: 'short' });
    ui.submit();

    expect(ui.error('name').hidden).toBe(false);
    expect(ui.error('email').hidden).toBe(true);
    expect(ui.error('message').hidden).toBe(false);
    expect(ui.field('name').getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement).toBe(ui.field('name'));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts the message as JSON and shows the sending state while waiting', async () => {
    const ui = mount();
    dispose = initContactForm();
    let resolve!: (response: Response) => void;
    fetchMock.mockReturnValue(new Promise<Response>((r) => (resolve = r)));
    ui.fill();
    ui.submit();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/send-email');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body)).toEqual({ name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello there, nice work!' });
    expect(ui.button.disabled).toBe(true);
    expect(ui.label.textContent).toBe('Sending...');
    expect(ui.form.getAttribute('aria-busy')).toBe('true');

    ui.submit();
    expect(fetchMock).toHaveBeenCalledOnce();

    resolve(respond(200, { ok: true }));
    await flush();
    expect(ui.button.disabled).toBe(false);
    expect(ui.label.textContent).toBe('Send Message');
    expect(ui.form.hasAttribute('aria-busy')).toBe(false);
  });

  it('confirms success and resets the form', async () => {
    const ui = mount();
    dispose = initContactForm();
    fetchMock.mockResolvedValue(respond(200, { ok: true }));
    ui.fill();
    ui.submit();
    await flush();

    expect(ui.status.textContent).toBe(COPY.success);
    expect(ui.status.dataset.state).toBe('success');
    expect(ui.field('name').value).toBe('');
    expect(ui.field('message').value).toBe('');
  });

  it('explains the rate limit with the hours remaining and keeps the input', async () => {
    const ui = mount();
    dispose = initContactForm();
    fetchMock.mockResolvedValue(respond(429, { error: 'rate-limited', hoursRemaining: 7 }));
    ui.fill();
    ui.submit();
    await flush();

    expect(ui.status.textContent).toBe('Limit reached. Try again in 7 h.');
    expect(ui.status.dataset.state).toBe('error');
    expect(ui.field('name').value).toBe('Ada Lovelace');
  });

  it('falls back to the full rate-limit window when the 429 body has no hours', async () => {
    const ui = mount();
    dispose = initContactForm();
    fetchMock.mockResolvedValue(new Response('Too Many Requests', { status: 429 }));
    ui.fill();
    ui.submit();
    await flush();

    expect(ui.status.textContent).toBe('Limit reached. Try again in 24 h.');
  });

  it('shows the generic error for server failures and network errors', async () => {
    const ui = mount();
    dispose = initContactForm();
    fetchMock.mockResolvedValueOnce(respond(500, { error: 'send-failed' }));
    ui.fill();
    ui.submit();
    await flush();
    expect(ui.status.textContent).toBe(COPY.error);
    expect(ui.status.dataset.state).toBe('error');
    expect(ui.button.disabled).toBe(false);

    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    ui.submit();
    await flush();
    expect(ui.status.textContent).toBe(COPY.error);
    expect(ui.field('message').value).toBe('Hello there, nice work!');
  });

  it('clears the previous status when submitting again', async () => {
    const ui = mount();
    dispose = initContactForm();
    fetchMock.mockResolvedValueOnce(respond(500, { error: 'send-failed' }));
    ui.fill();
    ui.submit();
    await flush();

    fetchMock.mockReturnValueOnce(new Promise(() => {}));
    ui.submit();
    expect(ui.status.textContent).toBe('');
    expect(ui.status.dataset.state).toBeUndefined();
  });

  it('stops listening once disposed', () => {
    const ui = mount();
    initContactForm()();
    ui.fill();
    expect(ui.submit()).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
