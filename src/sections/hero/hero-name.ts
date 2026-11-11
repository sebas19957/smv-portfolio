import gsap from 'gsap';
import type { IntroClock } from '../../features/intro/intro';
import { noop, type Dispose } from '../../shared/lib/dispose';
import { cellBoxes, parseNameVariant, type NameVariant } from './name-motion';
import { createOdometer } from './name-odometer';
import { createSpecimen } from './name-specimen';
import { createWeight } from './name-weight';

/** Longest wait (s) for the display face before the entrance plays anyway. */
export const NAME_FONT_TIMEOUT = 1.2;

/** What a name treatment gets once the letters are locked into their cells. */
export interface NameContext {
  readonly h1: HTMLElement;
  /** Word wrappers, in reading order. */
  readonly words: readonly HTMLElement[];
  /** Letter cells (fixed width), in reading order. */
  readonly chars: readonly HTMLElement[];
  /** The glyph inside each cell (the element that moves / changes weight). */
  readonly glyphs: readonly HTMLElement[];
}

export interface NameMotion {
  /** Paused entrance; the core plays it once the face is ready and registers it with the intro. */
  readonly entrance: gsap.core.Timeline;
  /** Runs or pauses the constant life (only called once the entrance has settled). */
  setRunning(run: boolean): void;
  /** Re-measures after the letters were re-locked (font swap, resize). */
  relayout?(): void;
  readonly dispose: Dispose;
}

export interface HeroName {
  /** Resolves once the entrance has settled (right away under reduced motion). */
  readonly settled: Promise<void>;
  readonly dispose: Dispose;
}

const TREATMENTS: Record<NameVariant, (ctx: NameContext) => NameMotion> = {
  a: createSpecimen,
  b: createOdometer,
  c: createWeight,
};

/** Loads the face the heading is set in (resolves either way). */
async function loadFace(el: HTMLElement): Promise<void> {
  if (!document.fonts) return;
  const font = getComputedStyle(el);
  await document.fonts.load(`${font.fontWeight} 1em ${font.fontFamily}`, el.textContent ?? '').catch(noop);
}

/** Wraps each letter's text in a glyph span (once), so the glyph can move inside its cell. */
function wrapGlyphs(chars: readonly HTMLElement[]): HTMLElement[] {
  return chars.map((char) => {
    const existing = char.querySelector<HTMLElement>('.name__glyph');
    if (existing) return existing;
    const glyph = document.createElement('span');
    glyph.className = 'name__glyph';
    glyph.textContent = char.textContent;
    char.replaceChildren(glyph);
    return glyph;
  });
}

/**
 * Locks every letter into a cell as wide as its kerned advance (read from the inline layout), with
 * the glyph centred and shifted back onto its kerned spot: the line looks and wraps exactly as the
 * plain text did, but glyphs can now move or change weight without reflowing anything.
 */
function lockCells(h1: HTMLElement, chars: readonly HTMLElement[]): void {
  delete h1.dataset.nameCells;
  const kerned = chars.map((char) => char.getBoundingClientRect().width);
  h1.dataset.nameCells = 'measure';
  const natural = chars.map((char) => char.getBoundingClientRect().width);
  const size = parseFloat(getComputedStyle(h1).fontSize);
  cellBoxes(kerned, natural, size).forEach(({ width, shift }, i) => {
    chars[i].style.setProperty('--cw', width);
    chars[i].style.setProperty('--cx', shift);
  });
  h1.dataset.nameCells = 'locked';
}

function unlockCells(h1: HTMLElement, chars: readonly HTMLElement[]): void {
  delete h1.dataset.nameCells;
  chars.forEach((char) => {
    char.style.removeProperty('--cw');
    char.style.removeProperty('--cx');
  });
}

/**
 * Hero name motion. Picks the treatment from `?name=a|b|c` (default "a"), waits (hidden, capped)
 * for the display face so nothing ever plays in the fallback font, locks the letters into cells and
 * plays the treatment's entrance (registered with the intro clock, so early input fast-forwards it).
 * Once settled the treatment's constant life runs, paused while the name is off-screen or the tab
 * is hidden. Reduced motion keeps the plain, static name.
 * Must run before the reveal controller releases the no-flash guard (start states first).
 */
export function initHeroName(intro: IntroClock): HeroName {
  const h1 = document.querySelector<HTMLElement>('[data-hero-name]');
  let resolveSettled: () => void = noop;
  const settled = new Promise<void>((resolve) => (resolveSettled = resolve));
  if (!h1) {
    resolveSettled();
    return { settled, dispose: noop };
  }

  const variant = parseNameVariant(window.location.search);
  h1.dataset.nameVariant = variant;
  const words = gsap.utils.toArray<HTMLElement>('[data-name-word]', h1);
  const chars = gsap.utils.toArray<HTMLElement>('.name__char', h1);
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    resolveSettled();
  });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    let motion: NameMotion | null = null;
    let ready = false;
    let visible = true;
    let started = false;
    let raf = 0;

    const sync = () => {
      const run = ready && visible && !document.hidden;
      if (ready) motion?.setRunning(run);
      if (run || !ready) delete h1.dataset.namePaused;
      else h1.dataset.namePaused = '';
    };

    gsap.set(h1, { visibility: 'hidden' });

    const start = () => {
      if (started) return;
      started = true;
      window.clearTimeout(fontTimer);
      const glyphs = wrapGlyphs(chars);
      lockCells(h1, chars);
      h1.dataset.nameState = 'entering';
      motion = TREATMENTS[variant]({ h1, words, chars, glyphs });
      const entrance = motion.entrance;
      entrance.eventCallback('onComplete', () => {
        h1.dataset.nameState = 'settled';
        resolveSettled();
        ready = true;
        sync();
      });
      intro.register(entrance);
      // One frame laid out in the loaded face while still hidden, so the lock is never seen.
      raf = requestAnimationFrame(
        () =>
          (raf = requestAnimationFrame(() => {
            gsap.set(h1, { clearProps: 'visibility' });
            entrance.play();
          })),
      );
    };
    const fontTimer = window.setTimeout(start, NAME_FONT_TIMEOUT * 1000);
    void loadFace(h1).then(start);

    // A face that lands after the timeout changes the advances: lock again and let the treatment re-measure.
    const onFonts = () => {
      if (!motion) return;
      lockCells(h1, chars);
      motion.relayout?.();
    };
    document.fonts?.addEventListener('loadingdone', onFonts);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(h1);
    document.addEventListener('visibilitychange', sync);

    return () => {
      started = true;
      window.clearTimeout(fontTimer);
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      document.fonts?.removeEventListener('loadingdone', onFonts);
      motion?.dispose();
      unlockCells(h1, chars);
      gsap.set(h1, { clearProps: 'visibility' });
      delete h1.dataset.namePaused;
      h1.dataset.nameState = 'settled';
      resolveSettled();
    };
  });

  return { settled, dispose: () => mm.revert() };
}
