/** Shared math and media helpers for the motion features. */

export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const prefersReducedMotion = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Height of the sticky site nav; every sticky offset and the rail mapping use it. */
export const NAV_H = 48;
