import type { Dispose } from '../../shared/lib/dispose';
import { FIELDS, RATE_LIMIT, isFieldValid, type ContactApiResponse, type FieldName } from './contact-message';

const ENDPOINT = '/api/send-email';

type StatusKey = 'success' | 'rateLimited' | 'error';

/**
 * Contact form: localized inline validation (rules shared with the API route), then a JSON POST
 * to `/api/send-email`. While sending, the submit button is disabled and shows the sending copy;
 * the outcome (sent, rate limited, failed) is announced in the polite live region. All copy is
 * rendered by the server as data attributes, so the controller stays locale-agnostic.
 */
export function initContactForm(): Dispose {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return () => {};
  const controller = new AbortController();
  const submit = form.querySelector<HTMLButtonElement>('[data-contact-submit]');
  const label = submit?.querySelector<HTMLElement>('.btn__label');
  const idleLabel = label?.textContent ?? '';
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  let sending = false;

  const control = (name: FieldName) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;

  const validate = (name: FieldName, show: boolean): boolean => {
    const field = control(name);
    const error = form.querySelector<HTMLElement>(`[data-field-error="${name}"]`);
    if (!field || !error) return true;
    const valid = isFieldValid(name, field.value);
    if (show || valid) {
      error.hidden = valid;
      field.setAttribute('aria-invalid', String(!valid));
    }
    return valid;
  };

  const setSending = (value: boolean) => {
    sending = value;
    if (submit) submit.disabled = value;
    if (label) label.textContent = value ? (form.dataset.sendingLabel ?? idleLabel) : idleLabel;
    if (value) form.setAttribute('aria-busy', 'true');
    else form.removeAttribute('aria-busy');
  };

  const announce = (key: StatusKey | null, hours: number = RATE_LIMIT.windowHours) => {
    if (!status) return;
    if (!key) {
      status.textContent = '';
      delete status.dataset.state;
      return;
    }
    status.textContent = (status.dataset[key] ?? '').replace('{hours}', String(hours));
    status.dataset.state = key === 'success' ? 'success' : 'error';
  };

  const send = async () => {
    setSending(true);
    announce(null);
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(FIELDS.map((name) => [name, control(name)?.value ?? '']))),
        signal: controller.signal,
      });
      if (response.ok) {
        form.reset();
        announce('success');
      } else if (response.status === 429) {
        const body = (await response.json().catch(() => null)) as ContactApiResponse | null;
        announce('rateLimited', body && 'hoursRemaining' in body ? body.hoursRemaining : undefined);
      } else {
        announce('error');
      }
    } catch {
      if (controller.signal.aborted) return;
      announce('error');
    }
    setSending(false);
  };

  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
      if (sending) return;
      const invalid = FIELDS.filter((name) => !validate(name, true));
      if (invalid.length) {
        control(invalid[0])?.focus();
        return;
      }
      void send();
    },
    { signal: controller.signal },
  );

  // Clear a field's error as soon as it becomes valid.
  form.addEventListener(
    'input',
    (event) => {
      const name = (event.target as HTMLInputElement).name as FieldName;
      if (FIELDS.includes(name)) validate(name, false);
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}
