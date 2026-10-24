import type { Dispose } from '../../shared/lib/dispose';

/**
 * Site navigation behaviour:
 * - hamburger opens the in-flow mobile menu (no animation, like the reference);
 * - scroll spy keeps the current section's pill permanently inverted;
 * - the language switch keeps the reader on the same section.
 */
export function initSiteNav(): Dispose {
  const nav = document.querySelector<HTMLElement>('[data-site-nav]');
  if (!nav) return () => {};
  const controller = new AbortController();
  const { signal } = controller;

  const toggle = nav.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = nav.querySelector<HTMLElement>('[data-mobile-menu]');
  const setMenu = (open: boolean) => {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'), { signal });
  nav.querySelectorAll('[data-menu-close]').forEach((link) =>
    link.addEventListener('click', () => setMenu(false), { signal }),
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    },
    { signal },
  );
  matchMedia('(min-width: 64rem)').addEventListener('change', (event) => event.matches && setMenu(false), { signal });

  // Scroll spy: the section crossing the viewport's middle line owns the inverted pill.
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
  let activeId = 'home';
  const setActive = (id: string) => {
    activeId = id;
    for (const link of links) {
      const isActive = link.dataset.navLink === id;
      link.dataset.active = String(isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  const sections = [...document.querySelectorAll<HTMLElement>('main section[id]')];
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    },
    { rootMargin: '-49% 0px -50% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
  setActive(activeId);

  // Switching language keeps the current section in view on the other locale's page.
  document.querySelectorAll<HTMLAnchorElement>('[data-locale-link]').forEach((link) =>
    link.addEventListener(
      'click',
      () => {
        if (activeId !== 'home') link.hash = activeId;
      },
      { signal },
    ),
  );

  return () => {
    controller.abort();
    observer.disconnect();
  };
}
