import type { Dispose } from '../../shared/lib/dispose';

type FieldName = 'name' | 'email' | 'message';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RULES: Record<FieldName, (value: string) => boolean> = {
  name: (value) => value.trim().length >= 3,
  email: (value) => EMAIL.test(value.trim()),
  message: (value) => value.trim().length >= 10,
};

/**
 * Contact form (UI only, no backend yet): submission is prevented and the localized inline
 * validation messages rendered by the server are toggled per field.
 */
export function initContactForm(): Dispose {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return () => {};
  const controller = new AbortController();

  const validate = (name: FieldName, show: boolean): boolean => {
    const control = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
    const error = form.querySelector<HTMLElement>(`[data-field-error="${name}"]`);
    if (!control || !error) return true;
    const valid = RULES[name](control.value);
    if (show || valid) {
      error.hidden = valid;
      control.setAttribute('aria-invalid', String(!valid));
    }
    return valid;
  };

  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
      const invalid = (Object.keys(RULES) as FieldName[]).filter((name) => !validate(name, true));
      if (invalid.length) (form.elements.namedItem(invalid[0]) as HTMLElement | null)?.focus();
    },
    { signal: controller.signal },
  );

  // Clear a field's error as soon as it becomes valid.
  form.addEventListener(
    'input',
    (event) => {
      const name = (event.target as HTMLInputElement).name as FieldName;
      if (name in RULES) validate(name, false);
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}
