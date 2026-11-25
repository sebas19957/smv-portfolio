// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initProjectSheet } from './project-sheet';

const SLUGS = ['daylo', 'mundial'];

function renderPage() {
  document.body.innerHTML = `
    <button type="button" data-project-open="daylo">Daylo</button>
    <button type="button" data-project-open="mundial">Mundial</button>
    <dialog data-project-sheet data-sheet-src="/project-sheets/en/" data-sheet-slugs="${SLUGS.join(' ')}">
      <p><span data-sheet-crumb></span></p>
      <button type="button" data-sheet-close>Close</button>
      <div data-sheet-scroll><div data-sheet-content></div></div>
      <div data-lightbox-root hidden>
        <img data-lightbox-img alt="" />
        <button type="button" data-lightbox-prev></button>
        <button type="button" data-lightbox-next></button>
        <button type="button" data-lightbox-close></button>
        <p data-lightbox-caption></p>
      </div>
    </dialog>`;
}

const sheet = (slug: string) =>
  `<meta name="robots" content="noindex"><article data-detail-slug="${slug}" data-title-id="title-${slug}"><span class="num-badge">0${SLUGS.indexOf(slug) + 1}</span><h2 id="title-${slug}">${slug}</h2></article>`;

type Deferred = { resolve: (response: Response) => void; reject: (error: unknown) => void };

/** fetch stub whose responses are released by the test, one deferred per call. */
function stubFetch() {
  const calls: { url: string; deferred: Deferred }[] = [];
  const fetchStub = vi.fn(
    (url: RequestInfo | URL) =>
      new Promise<Response>((resolve, reject) => calls.push({ url: String(url), deferred: { resolve, reject } })),
  );
  vi.stubGlobal('fetch', fetchStub);
  const respond = async (index: number, body: string, status = 200) => {
    calls[index].deferred.resolve(new Response(body, { status }));
    await flush();
  };
  return { calls, fetchStub, respond };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const click = (slug: string) => document.querySelector<HTMLElement>(`[data-project-open="${slug}"]`)!.click();
const dialog = () => document.querySelector<HTMLDialogElement>('[data-project-sheet]')!;
const mounted = () => dialog().querySelector<HTMLElement>('[data-detail-slug]')?.dataset.detailSlug;

describe('initProjectSheet', () => {
  let dispose = () => {};

  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    renderPage();
  });

  afterEach(() => {
    dispose();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('fetches a sheet on first open, then mounts it and opens the dialog', async () => {
    const { calls, respond } = stubFetch();
    dispose = initProjectSheet(null);

    click('daylo');
    expect(dialog().open).toBe(false);
    expect(calls[0].url).toBe('/project-sheets/en/daylo/');
    await respond(0, sheet('daylo'));

    expect(dialog().open).toBe(true);
    expect(mounted()).toBe('daylo');
    expect(dialog().querySelector('meta')).toBeNull();
    expect(dialog().getAttribute('aria-labelledby')).toBe('title-daylo');
    expect(location.hash).toBe('#project-daylo');
  });

  it('opens an already fetched sheet right away, without another request', async () => {
    const { fetchStub, respond } = stubFetch();
    dispose = initProjectSheet(null);
    click('daylo');
    await respond(0, sheet('daylo'));
    dialog().close();

    click('daylo');

    expect(dialog().open).toBe(true);
    expect(mounted()).toBe('daylo');
    expect(fetchStub).toHaveBeenCalledTimes(1);
  });

  it('never opens a broken sheet: a failed request leaves it closed and the next open retries', async () => {
    const { respond } = stubFetch();
    dispose = initProjectSheet(null);

    click('daylo');
    await respond(0, 'nope', 500);
    expect(dialog().open).toBe(false);

    click('daylo');
    await respond(1, sheet('daylo'));
    expect(dialog().open).toBe(true);
    expect(mounted()).toBe('daylo');
  });

  it('shows only the latest requested project when responses arrive out of order', async () => {
    const { respond } = stubFetch();
    dispose = initProjectSheet(null);

    click('daylo');
    click('mundial');
    await respond(1, sheet('mundial'));
    await respond(0, sheet('daylo'));

    expect(mounted()).toBe('mundial');
  });

  it('opens the deep-linked project on load', async () => {
    window.history.replaceState(null, '', '/#project-mundial');
    const { calls, respond } = stubFetch();
    dispose = initProjectSheet(null);

    expect(calls[0].url).toBe('/project-sheets/en/mundial/');
    await respond(0, sheet('mundial'));

    expect(dialog().open).toBe(true);
    expect(mounted()).toBe('mundial');
  });

  it('ignores unknown projects', () => {
    const { fetchStub } = stubFetch();
    window.history.replaceState(null, '', '/#project-unknown');
    dispose = initProjectSheet(null);

    expect(fetchStub).not.toHaveBeenCalled();
    expect(dialog().open).toBe(false);
  });
});
