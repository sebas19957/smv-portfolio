import type { Dispose } from '../../shared/lib/dispose';

/** Where a locale's sheet fragments live (`src/pages/project-sheets/[locale]/[slug].astro`). */
export const sheetBase = (locale: string) => `/project-sheets/${locale}/`;

/**
 * Project sheets are prerendered as standalone HTML fragments (`/project-sheets/<locale>/<slug>/`)
 * instead of inline <template>s, so the page itself stays light. The loader fetches each one at
 * most once, keeps it parsed in an inert <template> ready to clone, and forgets failures so the
 * next open simply tries again.
 */
export interface SheetLoader {
  /** The parsed sheet, if it has already been fetched. */
  get(slug: string): HTMLTemplateElement | undefined;
  /** Fetches (once) and parses a sheet; resolves `null` on failure. */
  load(slug: string): Promise<HTMLTemplateElement | null>;
  /** Fetches every given sheet (already loaded or in-flight ones are reused). */
  prefetch(slugs: Iterable<string>): Promise<void>;
  /** Aborts pending requests. */
  readonly dispose: Dispose;
}

export function createSheetLoader(
  urlFor: (slug: string) => string,
  fetchSheet: typeof fetch = (...args) => fetch(...args),
): SheetLoader {
  const ready = new Map<string, HTMLTemplateElement>();
  const pending = new Map<string, Promise<HTMLTemplateElement | null>>();
  const controller = new AbortController();

  const parse = (html: string) => {
    const template = document.createElement('template');
    template.innerHTML = html;
    // The fragment's robots meta only matters to crawlers; never mount it.
    template.content.querySelectorAll('meta').forEach((meta) => meta.remove());
    return template;
  };

  const load = (slug: string): Promise<HTMLTemplateElement | null> => {
    const hit = ready.get(slug);
    if (hit) return Promise.resolve(hit);
    const inFlight = pending.get(slug);
    if (inFlight) return inFlight;
    const request = fetchSheet(urlFor(slug), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Sheet "${slug}" answered ${response.status}`);
        return response.text();
      })
      .then((html) => {
        const template = parse(html);
        ready.set(slug, template);
        return template;
      })
      .catch(() => null)
      .finally(() => pending.delete(slug));
    pending.set(slug, request);
    return request;
  };

  return {
    get: (slug) => ready.get(slug),
    load,
    prefetch: async (slugs) => {
      await Promise.all([...slugs].map(load));
    },
    dispose: () => controller.abort(),
  };
}

/**
 * Runs `task` once the page has loaded, `delayMs` more have passed and the main thread is idle
 * (setTimeout fallback where `requestIdleCallback` is missing).
 */
export function afterLoadIdle(task: () => void, delayMs = 0): Dispose {
  let cancel = () => {};
  const idle = () => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(task, { timeout: 3000 });
      cancel = () => window.cancelIdleCallback(id);
    } else {
      const id = window.setTimeout(task, 200);
      cancel = () => window.clearTimeout(id);
    }
  };
  const loaded = () => {
    const id = window.setTimeout(idle, delayMs);
    cancel = () => window.clearTimeout(id);
  };
  if (document.readyState === 'complete') loaded();
  else {
    window.addEventListener('load', loaded, { once: true });
    cancel = () => window.removeEventListener('load', loaded);
  }
  return () => cancel();
}
