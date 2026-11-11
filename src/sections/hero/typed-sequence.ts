import { graphemes } from '../../shared/lib/graphemes';

/**
 * Pure sequencing for the hero's typed line: an endless list of screen states ("steps") that a
 * player shows one after another, each for its own duration. Characters decode in through a few
 * random glyphs before they settle, the full phrase holds, then it is backspaced and the next one
 * starts. Randomness is injected so the rhythm is testable.
 */

/** typing / erasing keep the caret solid; holding / waiting let it blink. */
export type TypedPhase = 'typing' | 'holding' | 'erasing' | 'waiting';

export interface TypedStep {
  /** Index of the phrase on screen. */
  readonly phrase: number;
  /** Settled text, rendered in ink. */
  readonly text: string;
  /** Transient decode glyph drawn after the text ('' when none). */
  readonly glyph: string;
  readonly phase: TypedPhase;
  /** How long this state stays on screen, in ms. */
  readonly duration: number;
}

export interface TypedTiming {
  /** Delay after a character settles, in ms (random within the range). */
  readonly typeMin: number;
  readonly typeMax: number;
  /** Extra pause after a space, so words land in small bursts. */
  readonly wordPauseMin: number;
  readonly wordPauseMax: number;
  /** Decode glyphs shown before each visible character settles (inclusive range). */
  readonly decodeMin: number;
  readonly decodeMax: number;
  /** Duration of each decode glyph frame, in ms. */
  readonly frameMin: number;
  readonly frameMax: number;
  /** Time the full phrase stays on screen. */
  readonly hold: number;
  /** First backspace delay; the next ones speed up by `eraseAccel` down to `eraseMin`. */
  readonly eraseStart: number;
  readonly eraseAccel: number;
  readonly eraseMin: number;
  /** Empty-line pause before the next phrase. */
  readonly gap: number;
}

export const TYPED_TIMING: TypedTiming = {
  typeMin: 14,
  typeMax: 34,
  wordPauseMin: 20,
  wordPauseMax: 55,
  decodeMin: 1,
  decodeMax: 2,
  frameMin: 14,
  frameMax: 22,
  hold: 2000,
  eraseStart: 45,
  eraseAccel: 0.8,
  eraseMin: 10,
  gap: 260,
};

/** Code-flavoured glyphs that flicker before a character settles. */
export const DECODE_GLYPHS = '<>/\\{}[]=+*#%&$_01';

export interface TypedStepsOptions {
  readonly timing?: TypedTiming;
  /** Uniform source in [0, 1); defaults to Math.random. */
  readonly random?: () => number;
}

export function* typedSteps(
  phrases: readonly string[],
  { timing = TYPED_TIMING, random = Math.random }: TypedStepsOptions = {},
): Generator<TypedStep, void, undefined> {
  const list = phrases.map((text, index) => ({ index, chars: graphemes(text) })).filter((p) => p.chars.join('').trim());
  if (!list.length) return;

  const between = (min: number, max: number) => Math.round(min + random() * (max - min));
  const pickGlyph = (avoid: readonly string[]) => {
    const pool = Array.from(DECODE_GLYPHS).filter((glyph) => !avoid.includes(glyph));
    return pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))];
  };

  for (let i = 0; ; i = (i + 1) % list.length) {
    const { index: phrase, chars } = list[i];

    for (let k = 0; k < chars.length; k++) {
      const char = chars[k];
      const before = chars.slice(0, k).join('');
      if (/^\s+$/.test(char)) {
        const duration = between(timing.typeMin, timing.typeMax) + between(timing.wordPauseMin, timing.wordPauseMax);
        yield { phrase, text: before + char, glyph: '', phase: 'typing', duration };
        continue;
      }
      const span = timing.decodeMax - timing.decodeMin + 1;
      const frames = timing.decodeMin + Math.min(span - 1, Math.floor(random() * span));
      let glyph = '';
      for (let f = 0; f < frames; f++) {
        glyph = pickGlyph([char, glyph]);
        yield { phrase, text: before, glyph, phase: 'typing', duration: between(timing.frameMin, timing.frameMax) };
      }
      yield { phrase, text: before + char, glyph: '', phase: 'typing', duration: between(timing.typeMin, timing.typeMax) };
    }

    yield { phrase, text: chars.join(''), glyph: '', phase: 'holding', duration: timing.hold };
    if (list.length === 1) return;

    let delay = timing.eraseStart;
    for (let k = chars.length - 1; k >= 0; k--) {
      yield { phrase, text: chars.slice(0, k).join(''), glyph: '', phase: 'erasing', duration: Math.round(delay) };
      delay = Math.max(timing.eraseMin, delay * timing.eraseAccel);
    }
    yield { phrase, text: '', glyph: '', phase: 'waiting', duration: timing.gap };
  }
}

export interface TypedPlayerOptions {
  readonly steps: Iterator<TypedStep>;
  readonly render: (step: TypedStep) => void;
  /** Reasons the player starts blocked (e.g. waiting for the entrance, off-screen). */
  readonly blockers?: readonly string[];
}

export interface TypedPlayer {
  block(reason: string): void;
  unblock(reason: string): void;
  dispose(): void;
}

/**
 * Walks the steps with timers while nothing blocks it. A block freezes the current state; on
 * release the current step dwells for its full duration again before the next one.
 */
export function createTypedPlayer({ steps, render, blockers = [] }: TypedPlayerOptions): TypedPlayer {
  const blocked = new Set(blockers);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let current: TypedStep | undefined;
  let done = false;

  const stop = () => {
    if (timer === undefined) return;
    clearTimeout(timer);
    timer = undefined;
  };

  const schedule = (delay: number) => {
    if (done || blocked.size || timer !== undefined) return;
    timer = setTimeout(advance, delay);
  };

  function advance() {
    timer = undefined;
    const next = steps.next();
    if (next.done) {
      done = true;
      return;
    }
    current = next.value;
    render(current);
    schedule(current.duration);
  }

  schedule(0);

  return {
    block(reason) {
      blocked.add(reason);
      stop();
    },
    unblock(reason) {
      if (!blocked.delete(reason)) return;
      schedule(current ? current.duration : 0);
    },
    dispose() {
      done = true;
      stop();
    },
  };
}
