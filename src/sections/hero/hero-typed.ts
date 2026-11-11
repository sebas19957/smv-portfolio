import gsap from 'gsap';
import { noop, type Dispose } from '../../shared/lib/dispose';
import { createTypedPlayer, typedSteps, type TypedStep } from './typed-sequence';

/** Beat between the name settling and the first keystroke, in ms. */
export const TYPED_START_DELAY = 260;

/**
 * Drives the hero's typed line (markup in `HeroTyped.astro`). Starts once the name entrance has
 * settled, pauses while the line is off-screen or the tab is hidden, and puts the static first
 * phrase back under reduced motion.
 */
export function initHeroTyped(entrance: Promise<void>): Dispose {
  const root = document.querySelector<HTMLElement>('[data-typed]');
  const text = root?.querySelector<HTMLElement>('[data-typed-text]');
  const glyph = root?.querySelector<HTMLElement>('[data-typed-glyph]');
  if (!root || !text || !glyph) return noop;

  const phrases = Array.from(root.querySelectorAll('[data-typed-phrase]'), (el) => el.textContent ?? '');
  const fallback = text.textContent ?? '';
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    let flicker = 0;
    const render = (step: TypedStep) => {
      if (text.textContent !== step.text) text.textContent = step.text;
      if (glyph.textContent !== step.glyph) {
        glyph.textContent = step.glyph;
        // Decode glyphs alternate between the accent and a faint ink.
        if (step.glyph) glyph.dataset.tone = flicker++ % 2 ? 'muted' : 'accent';
      }
      if (root.dataset.phase !== step.phase) root.dataset.phase = step.phase;
    };

    // Empty line with a resting caret until the name has landed.
    render({ phrase: 0, text: '', glyph: '', phase: 'waiting', duration: 0 });
    const player = createTypedPlayer({ steps: typedSteps(phrases), render, blockers: ['entrance', 'offscreen'] });

    let alive = true;
    let startTimer = 0;
    void entrance.then(() => {
      if (alive) startTimer = window.setTimeout(() => player.unblock('entrance'), TYPED_START_DELAY);
    });

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) player.unblock('offscreen');
      else player.block('offscreen');
    });
    io.observe(root);

    const onVisibility = () => {
      if (document.hidden) player.block('hidden');
      else player.unblock('hidden');
    };
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();

    return () => {
      alive = false;
      window.clearTimeout(startTimer);
      player.dispose();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      text.textContent = fallback;
      glyph.textContent = '';
      delete root.dataset.phase;
    };
  });

  return () => mm.revert();
}
