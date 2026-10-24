import type { Dispose } from '../lib/dispose';

/** Wires every `[data-split-button]`: chevron toggles its menu; outside click / Escape closes it. */
export function initSplitButtons(root: ParentNode = document): Dispose {
  const groups = [...root.querySelectorAll<HTMLElement>('[data-split-button]')];
  const controller = new AbortController();
  const { signal } = controller;

  const setOpen = (group: HTMLElement, open: boolean) => {
    const toggle = group.querySelector<HTMLButtonElement>('[data-split-toggle]');
    const menu = group.querySelector<HTMLElement>('[data-split-menu]');
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };

  for (const group of groups) {
    const toggle = group.querySelector<HTMLButtonElement>('[data-split-toggle]');
    toggle?.addEventListener(
      'click',
      () => setOpen(group, toggle.getAttribute('aria-expanded') !== 'true'),
      { signal },
    );
  }

  document.addEventListener(
    'click',
    (event) => {
      for (const group of groups) {
        if (!group.contains(event.target as Node)) setOpen(group, false);
      }
    },
    { signal },
  );

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Escape') return;
      for (const group of groups) {
        const wasOpen = group.querySelector('[data-split-toggle]')?.getAttribute('aria-expanded') === 'true';
        setOpen(group, false);
        if (wasOpen) group.querySelector<HTMLElement>('[data-split-toggle]')?.focus();
      }
    },
    { signal },
  );

  return () => controller.abort();
}
