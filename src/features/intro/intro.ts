import gsap from 'gsap';
import { noop, type Dispose } from '../../shared/lib/dispose';
import { prefersReducedMotion } from '../../shared/lib/motion';

/** Intro clock defaults from the reference tuner ("Intro"). */
export const INTRO = {
  /** Instrument (rail ticks) and nav assemble at this time, in seconds. */
  instrAt: 0.7,
  /** Cards start revealing at this time; the intro ends 3s later. */
  cardsAt: 1,
  /** Any user input during the intro fast-forwards it ("never a jump cut"). */
  ffScale: 4,
} as const;

const FAST_FORWARD_EVENTS = ['wheel', 'pointerdown', 'keydown', 'touchstart'] as const;

export interface IntroClock {
  /** Registers a load-in timeline so user input fast-forwards it with the rest of the intro. */
  register(timeline: gsap.core.Timeline): void;
  /** True once the load-in has finished (or was skipped). */
  isDone(): boolean;
  readonly dispose: Dispose;
}

/**
 * Shared load-in clock. Sequences the nav stagger (and, via `register`, the rail tick cascade)
 * and speeds everything up ×4 on the first wheel / pointer / key / touch during the intro.
 */
export function initIntro(): IntroClock {
  const html = document.documentElement;
  if (prefersReducedMotion()) return { register: noop, isDone: () => true, dispose: noop };

  const timelines = new Set<gsap.core.Timeline>();
  let fast = false;
  let done = false;
  html.dataset.intro = '';

  const fastForward = () => {
    fast = true;
    timelines.forEach((tl) => tl.timeScale(INTRO.ffScale));
    removeListeners();
  };
  const removeListeners = () =>
    FAST_FORWARD_EVENTS.forEach((type) => window.removeEventListener(type, fastForward));
  FAST_FORWARD_EVENTS.forEach((type) => window.addEventListener(type, fastForward, { passive: true }));

  const register = (tl: gsap.core.Timeline) => {
    timelines.add(tl);
    if (fast) tl.timeScale(INTRO.ffScale);
  };

  // Nav contents: both halves of the bar drop in 6px with a 0.08s stagger after instrAt.
  const navItems = gsap.utils.toArray<HTMLElement>('[data-intro-item]');
  if (navItems.length) {
    gsap.set(navItems, { autoAlpha: 0, y: -6 });
    // The lead-in is a spacer tween (not `delay`) so a fast-forward also shortens the wait.
    const nav = gsap.timeline().to({}, { duration: INTRO.instrAt });
    nav.to(navItems,{ autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'all' });
    register(nav);
  }

  const end = gsap.delayedCall(INTRO.cardsAt + 3, () => {
    done = true;
    delete html.dataset.intro;
    removeListeners();
  });

  return {
    register,
    isDone: () => done,
    dispose: () => {
      end.kill();
      removeListeners();
      timelines.forEach((tl) => tl.kill());
      delete html.dataset.intro;
    },
  };
}
