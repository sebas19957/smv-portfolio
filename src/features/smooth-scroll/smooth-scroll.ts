import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { noop, type Dispose } from '../../shared/lib/dispose';
import { prefersReducedMotion } from '../../shared/lib/motion';

gsap.registerPlugin(ScrollTrigger);

export interface SmoothScroll {
  /** `null` under reduced motion: native scrolling is kept. */
  readonly lenis: Lenis | null;
  readonly dispose: Dispose;
}

/**
 * Lenis smooth wheel scrolling driven by the GSAP ticker (lerp 0.12, anchors on), exactly as the
 * reference wires it. Every scrubbed effect reads the smoothed `window.scrollY` it produces.
 */
export function initSmoothScroll(): SmoothScroll {
  if (prefersReducedMotion()) return { lenis: null, dispose: noop };

  const lenis = new Lenis({ lerp: 0.12, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    dispose: () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    },
  };
}
