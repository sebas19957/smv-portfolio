import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Dispose } from '../../shared/lib/dispose';

gsap.registerPlugin(ScrollTrigger);

/** Reveal presets (blur + fade + 28px rise) shared with the filters. */
export const REVEAL_FROM: gsap.TweenVars = { autoAlpha: 0, y: 28, filter: 'blur(8px)' };
export const REVEAL_TO: gsap.TweenVars = {
  autoAlpha: 1,
  y: 0,
  filter: 'blur(0px)',
  duration: 0.9,
  ease: 'power3.out',
  overwrite: true,
  clearProps: 'all',
};

/** Max left→right stagger across a grid row, in seconds. */
export const GROUP_STAGGER = 0.18;

declare global {
  interface Window {
    __motionFailsafe?: number;
  }
}

/**
 * Scroll reveals (port of the reference choreography):
 * - `[data-choreo]` sections: rule draws from the left, eyebrow rises, corner ticks pop.
 * - `[data-reveal]` blocks rise individually at `top 85%`.
 * - `[data-reveal-group]` grids: each cell at `top 88%`, delayed by its x position (0 → 0.18s).
 * Triggers fire once. The CSS no-flash guard is released as soon as start states are applied.
 */
export function initReveals(): Dispose {
  const html = document.documentElement;
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray<HTMLElement>('[data-choreo]').forEach((section) => {
      const rule = section.querySelector('[data-draw-rule]');
      const ticks = section.querySelectorAll('[data-draw-tick]');
      const eyebrow = section.querySelector('[data-draw-eyebrow]');
      if (rule) gsap.set(rule, { scaleX: 0 });
      if (ticks.length) gsap.set(ticks, { scale: 0, opacity: 0 });
      if (eyebrow) gsap.set(eyebrow, REVEAL_FROM);
      ScrollTrigger.create({
        trigger: section,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          if (rule) tl.to(rule, { scaleX: 1, duration: 0.7, ease: 'power2.out', clearProps: 'all' }, 0);
          if (eyebrow) tl.to(eyebrow, { ...REVEAL_TO }, 0.15);
          if (ticks.length) {
            tl.to(ticks, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out', stagger: 0.06, clearProps: 'all' }, 0.35);
          }
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal]:not([data-reveal-group] [data-reveal])').forEach((el) => {
      gsap.set(el, REVEAL_FROM);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => gsap.to(el, REVEAL_TO),
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const items = [...group.querySelectorAll<HTMLElement>('[data-reveal]')];
      if (!items.length) return;
      gsap.set(items, REVEAL_FROM);
      const box = group.getBoundingClientRect();
      items.forEach((el) => {
        const delay = box.width > 0 ? ((el.getBoundingClientRect().left - box.left) / box.width) * GROUP_STAGGER : 0;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => gsap.to(el, { ...REVEAL_TO, delay }),
        });
      });
    });
  });

  // Start states are now inline: release the CSS guard and cancel the fail-safe.
  html.classList.add('motion-ready');
  if (window.__motionFailsafe) window.clearTimeout(window.__motionFailsafe);

  return () => mm.revert();
}
