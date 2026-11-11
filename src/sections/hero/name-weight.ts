import gsap from 'gsap';
import type { NameContext, NameMotion } from './hero-name';
import { weightAxes, WEIGHT_REST } from './name-motion';

/**
 * Variant "c" timing (s). Archivo is variable on weight (100–900) and width (62–125%); the cells keep
 * the line fixed, so both axes can move freely inside them.
 */
export const WEIGHT = {
  /** Entrance: hairline and narrow, swelling to the heading axes letter after letter. */
  fromWeight: 100,
  fromStretch: 96,
  grow: 1.5,
  growStagger: 0.04,
  fade: 0.5,
  /** Swell: each letter lightens for `down` and recovers for `up`; the band travels `stagger` per letter. */
  down: 0.6,
  up: 0.9,
  stagger: 0.11,
  rest: 2.8,
} as const;

/**
 * Variant "c", kinetic weight. The name appears as a hairline and swells to its heading weight and
 * width letter by letter. Once settled, every few seconds a soft swell of the weight axis travels
 * across it: each letter in turn grows lighter while its width opens (so it keeps its footprint),
 * then fills back in. Lines never move: the glyphs change inside fixed cells.
 */
export function createWeight(ctx: NameContext): NameMotion {
  const { glyphs } = ctx;
  const dip = weightAxes(1);

  gsap.set(glyphs, { '--wg': WEIGHT.fromWeight, '--ws': WEIGHT.fromStretch, opacity: 0 });
  const entrance = gsap.timeline({ paused: true });
  entrance.to(
    glyphs,
    { '--wg': WEIGHT_REST.weight, '--ws': WEIGHT_REST.stretch, duration: WEIGHT.grow, ease: 'power3.inOut', stagger: WEIGHT.growStagger },
    0,
  );
  entrance.to(glyphs, { opacity: 1, duration: WEIGHT.fade, ease: 'power1.out', stagger: WEIGHT.growStagger, clearProps: 'opacity' }, 0);

  // Rest, then the swell: a band about ten letters wide crossing the name in reading order.
  const life = gsap.timeline({ paused: true, repeat: -1 });
  life.to({}, { duration: WEIGHT.rest });
  life.to(glyphs, { '--wg': dip.weight, '--ws': dip.stretch, duration: WEIGHT.down, ease: 'sine.inOut', stagger: WEIGHT.stagger }, WEIGHT.rest);
  life.to(
    glyphs,
    { '--wg': WEIGHT_REST.weight, '--ws': WEIGHT_REST.stretch, duration: WEIGHT.up, ease: 'sine.inOut', stagger: WEIGHT.stagger },
    WEIGHT.rest + WEIGHT.down,
  );

  return {
    entrance,
    setRunning: (run) => (run ? life.resume() : life.pause()),
    dispose: () => {
      entrance.kill();
      life.kill();
      gsap.set(glyphs, { clearProps: '--wg,--ws,opacity' });
    },
  };
}
