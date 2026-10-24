import type { Dispose } from '../../shared/lib/dispose';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
/** Color tokens tween for 0.4s; the class is removed a beat later. */
const ANIMATION_MS = 450;

function currentTheme(): Theme {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Switches theme with the animated token transition used by the reference. */
export function applyTheme(theme: Theme): void {
  const html = document.documentElement;
  html.classList.add('theme-anim');
  void html.offsetWidth; // force a reflow so the transition starts from the current colors
  html.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the theme still applies for this visit.
  }
  window.setTimeout(() => html.classList.remove('theme-anim'), ANIMATION_MS);
}

export function initThemeToggles(root: ParentNode = document): Dispose {
  const controller = new AbortController();
  root.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark'), {
      signal: controller.signal,
    });
  });
  return () => controller.abort();
}
