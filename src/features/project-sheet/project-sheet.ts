import type Lenis from 'lenis';
import { noop, type Dispose } from '../../shared/lib/dispose';
import { prefersReducedMotion } from '../../shared/lib/motion';
import { afterLoadIdle, createSheetLoader } from './sheet-loader';

const HASH_PREFIX = '#project-';
const CLOSE_MS = 260;
/** Quiet period after `load` before prefetching sheets: well clear of the hero entrance. */
const PREFETCH_DELAY_MS = 2000;

/**
 * Project detail sheet controller:
 * - `[data-project-open="<slug>"]` triggers mount that project's sheet into the dialog. Sheets are
 *   prerendered fragments (`data-sheet-src` + slug) prefetched once the page has settled, so opening
 *   one is instant; one requested before that opens as soon as it arrives (a failed request leaves
 *   the sheet closed and the next open retries; only the latest request ever opens);
 * - deep links `#project-<slug>` open on load and follow back/forward navigation;
 * - the page is scroll-locked (Lenis stopped) while the sheet scrolls on its own;
 * - ESC / close button / backdrop click close it, focus returns to the trigger;
 * - images marked `data-lightbox` open in an in-sheet lightbox (arrows, ESC, buttons).
 */
export function initProjectSheet(lenis: Lenis | null): Dispose {
  const dialog = document.querySelector<HTMLDialogElement>('[data-project-sheet]');
  if (!dialog) return noop;
  const html = document.documentElement;
  const content = dialog.querySelector<HTMLElement>('[data-sheet-content]')!;
  const scroller = dialog.querySelector<HTMLElement>('[data-sheet-scroll]')!;
  const crumb = dialog.querySelector<HTMLElement>('[data-sheet-crumb]')!;
  const lightbox = dialog.querySelector<HTMLElement>('[data-lightbox-root]')!;
  const lightboxImg = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]')!;
  const lightboxCaption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const prevButton = dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]')!;
  const nextButton = dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]')!;
  const slugs = new Set((dialog.dataset.sheetSlugs ?? '').split(' ').filter(Boolean));
  const loader = createSheetLoader((slug) => `${dialog.dataset.sheetSrc ?? ''}${encodeURIComponent(slug)}/`);
  const cancelPrefetch = afterLoadIdle(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!connection?.saveData) void loader.prefetch(slugs);
  }, PREFETCH_DELAY_MS);

  const controller = new AbortController();
  const { signal } = controller;
  let current: string | null = null;
  let returnFocus: HTMLElement | null = null;
  let pushedEntry = false;
  let closing = 0;
  let shots: HTMLElement[] = [];
  let shotIndex = 0;
  /** Bumped by every open / close, so a sheet that arrives late only opens if still wanted. */
  let request = 0;

  const slugFromHash = () => (location.hash.startsWith(HASH_PREFIX) ? decodeURIComponent(location.hash.slice(HASH_PREFIX.length)) : null);

  const mount = (slug: string, template: HTMLTemplateElement) => {
    content.replaceChildren(template.content.cloneNode(true));
    const article = content.querySelector<HTMLElement>('[data-detail-slug]');
    const titleId = article?.dataset.titleId;
    if (titleId) dialog.setAttribute('aria-labelledby', titleId);
    const index = article?.querySelector('.num-badge')?.textContent ?? '';
    crumb.textContent = index ? `\u00a0·\u00a0${index}` : '';
    scroller.scrollTop = 0;
    current = slug;
    closeLightbox();
  };

  const open = (slug: string, history: 'push' | 'replace' | 'none') => {
    if (!slugs.has(slug)) return;
    const token = ++request;
    const ready = loader.get(slug);
    if (ready) show(slug, ready, history);
    else
      void loader.load(slug).then((template) => {
        if (template && token === request) show(slug, template, history);
      });
  };

  const show = (slug: string, template: HTMLTemplateElement, history: 'push' | 'replace' | 'none') => {
    mount(slug, template);
    window.clearTimeout(closing);
    dialog.classList.remove('is-closing');
    if (!dialog.open) {
      returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      html.classList.add('sheet-open');
      lenis?.stop();
    }
    const url = `${location.pathname}${location.search}${HASH_PREFIX}${encodeURIComponent(slug)}`;
    if (history === 'push') {
      window.history.pushState({ projectSheet: slug }, '', url);
      pushedEntry = true;
    } else if (history === 'replace') {
      window.history.replaceState(window.history.state, '', url);
    }
  };

  const finishClose = () => {
    dialog.classList.remove('is-closing');
    if (dialog.open) dialog.close();
  };

  const close = () => {
    request++;
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    if (prefersReducedMotion()) {
      finishClose();
      return;
    }
    dialog.classList.add('is-closing');
    closing = window.setTimeout(finishClose, CLOSE_MS);
  };

  // Native `close` (after our animation, or forced): unlock the page and tidy the URL.
  dialog.addEventListener(
    'close',
    () => {
      html.classList.remove('sheet-open');
      lenis?.start();
      current = null;
      closeLightbox();
      if (slugFromHash()) {
        if (pushedEntry) window.history.back();
        else window.history.replaceState(window.history.state, '', `${location.pathname}${location.search}`);
      }
      pushedEntry = false;
      returnFocus?.focus({ preventScroll: true });
      returnFocus = null;
    },
    { signal },
  );

  // ESC: close the lightbox first, then the sheet (animated).
  dialog.addEventListener(
    'cancel',
    (event) => {
      event.preventDefault();
      if (!lightbox.hidden) closeLightbox();
      else close();
    },
    { signal },
  );

  // Backdrop click (outside the panel).
  dialog.addEventListener(
    'click',
    (event) => {
      if (event.target === dialog) close();
    },
    { signal },
  );

  dialog.querySelector('[data-sheet-close]')?.addEventListener('click', close, { signal });

  // Open triggers anywhere (cards, related-part links inside the sheet).
  document.addEventListener(
    'click',
    (event) => {
      const trigger = (event.target as Element | null)?.closest<HTMLElement>('[data-project-open]');
      if (!trigger) return;
      event.preventDefault();
      event.stopPropagation();
      const slug = trigger.dataset.projectOpen ?? '';
      open(slug, dialog.open ? 'replace' : 'push');
    },
    { signal, capture: true },
  );

  // Back / forward and manual hash edits.
  const sync = () => {
    const slug = slugFromHash();
    if (slug && slugs.has(slug)) {
      // Opened by navigation (typed hash, back/forward): closing should not walk history back.
      pushedEntry = false;
      if (slug !== current) open(slug, 'none');
    } else if (dialog.open) {
      pushedEntry = false;
      close();
    } else {
      request++;
    }
  };
  window.addEventListener('popstate', sync, { signal });
  window.addEventListener('hashchange', sync, { signal });

  // ---------- Lightbox ----------
  function showShot(index: number) {
    if (!shots.length) return;
    shotIndex = (index + shots.length) % shots.length;
    const shot = shots[shotIndex];
    lightboxImg.src = shot.dataset.lightbox ?? '';
    lightboxImg.alt = shot.dataset.lightboxAlt ?? '';
    const caption = shot.dataset.lightboxCaption;
    const position = `${String(shotIndex + 1).padStart(2, '0')} / ${String(shots.length).padStart(2, '0')}`;
    lightboxCaption.textContent = caption ? `${position} · ${caption}` : position;
    prevButton.hidden = nextButton.hidden = shots.length < 2;
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImg.removeAttribute('src');
    shots[shotIndex]?.focus({ preventScroll: true });
  }

  content.addEventListener(
    'click',
    (event) => {
      const shot = (event.target as Element | null)?.closest<HTMLElement>('[data-lightbox]');
      if (!shot) return;
      shots = [...content.querySelectorAll<HTMLElement>('[data-lightbox]')];
      lightbox.hidden = false;
      showShot(shots.indexOf(shot));
      dialog.querySelector<HTMLElement>('[data-lightbox-close]')?.focus();
    },
    { signal },
  );
  prevButton.addEventListener('click', () => showShot(shotIndex - 1), { signal });
  nextButton.addEventListener('click', () => showShot(shotIndex + 1), { signal });
  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox, { signal });
  lightbox.addEventListener(
    'click',
    (event) => {
      if (event.target === lightbox) closeLightbox();
    },
    { signal },
  );
  dialog.addEventListener(
    'keydown',
    (event) => {
      if (lightbox.hidden) return;
      if (event.key === 'ArrowLeft') showShot(shotIndex - 1);
      if (event.key === 'ArrowRight') showShot(shotIndex + 1);
    },
    { signal },
  );

  // Deep link on load.
  const initial = slugFromHash();
  if (initial) open(initial, 'none');

  return () => {
    controller.abort();
    cancelPrefetch();
    loader.dispose();
    window.clearTimeout(closing);
    if (dialog.open) dialog.close();
  };
}
