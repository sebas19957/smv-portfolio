// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { afterLoadIdle, createSheetLoader } from './sheet-loader';

const urlFor = (slug: string) => `/project-sheets/en/${slug}/`;
const page = (slug: string) => `<meta name="robots" content="noindex"><article data-detail-slug="${slug}">${slug}</article>`;

function okFetch() {
  return vi.fn(async (url: RequestInfo | URL) => new Response(page(String(url).split('/').at(-2)!), { status: 200 }));
}

describe('createSheetLoader', () => {
  it('has nothing ready before a sheet is fetched', () => {
    const loader = createSheetLoader(urlFor, okFetch());

    expect(loader.get('daylo')).toBeUndefined();
  });

  it('fetches a sheet from its URL and keeps the parsed content, without the robots meta', async () => {
    const fetchSheet = okFetch();
    const loader = createSheetLoader(urlFor, fetchSheet);

    const sheet = await loader.load('daylo');

    expect(fetchSheet).toHaveBeenCalledWith('/project-sheets/en/daylo/', expect.anything());
    expect(sheet?.content.querySelector('[data-detail-slug="daylo"]')).not.toBeNull();
    expect(sheet?.content.querySelector('meta')).toBeNull();
    expect(loader.get('daylo')).toBe(sheet);
  });

  it('fetches each sheet once, even when asked again while the first request is in flight', async () => {
    const fetchSheet = okFetch();
    const loader = createSheetLoader(urlFor, fetchSheet);

    const [a, b] = await Promise.all([loader.load('daylo'), loader.load('daylo')]);
    await loader.load('daylo');

    expect(fetchSheet).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
  });

  it('resolves null on a failed request and retries on the next load', async () => {
    const fetchSheet = vi
      .fn()
      .mockResolvedValueOnce(new Response('missing', { status: 404 }))
      .mockRejectedValueOnce(new TypeError('offline'))
      .mockResolvedValueOnce(new Response(page('daylo'), { status: 200 }));
    const loader = createSheetLoader(urlFor, fetchSheet);

    expect(await loader.load('daylo')).toBeNull();
    expect(await loader.load('daylo')).toBeNull();
    expect(loader.get('daylo')).toBeUndefined();
    expect(await loader.load('daylo')).not.toBeNull();
    expect(fetchSheet).toHaveBeenCalledTimes(3);
  });

  it('prefetches every sheet', async () => {
    const fetchSheet = okFetch();
    const loader = createSheetLoader(urlFor, fetchSheet);

    await loader.prefetch(['daylo', 'mundial']);

    expect(loader.get('daylo')).toBeDefined();
    expect(loader.get('mundial')).toBeDefined();
  });

  it('aborts pending requests on dispose', async () => {
    let signal: AbortSignal | undefined;
    const fetchSheet = vi.fn((_url: RequestInfo | URL, init?: RequestInit) => {
      signal = init?.signal ?? undefined;
      return new Promise<Response>(() => {});
    });
    const loader = createSheetLoader(urlFor, fetchSheet);

    void loader.load('daylo');
    loader.dispose();

    expect(signal?.aborted).toBe(true);
  });
});

describe('afterLoadIdle', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs the task once the page has loaded and the main thread is idle', () => {
    vi.useFakeTimers();
    const task = vi.fn();

    afterLoadIdle(task);
    expect(task).not.toHaveBeenCalled();
    vi.runAllTimers();

    expect(task).toHaveBeenCalledTimes(1);
  });

  it('waits the given quiet period after load before looking for idle time', () => {
    vi.useFakeTimers();
    const task = vi.fn();

    afterLoadIdle(task, 2000);
    vi.advanceTimersByTime(1999);
    expect(task).not.toHaveBeenCalled();
    vi.runAllTimers();

    expect(task).toHaveBeenCalledTimes(1);
  });

  it('can be cancelled before it runs', () => {
    vi.useFakeTimers();
    const task = vi.fn();

    const cancel = afterLoadIdle(task);
    cancel();
    vi.runAllTimers();

    expect(task).not.toHaveBeenCalled();
  });
});
