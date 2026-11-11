import { afterEach, describe, expect, it, vi } from 'vitest';
import { DECODE_GLYPHS, TYPED_TIMING, createTypedPlayer, typedSteps, type TypedStep } from './typed-sequence';

/** Small seeded PRNG (mulberry32) so every run walks the same "random" rhythm. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function take(phrases: readonly string[], count: number, seed = 7): TypedStep[] {
  const steps: TypedStep[] = [];
  for (const step of typedSteps(phrases, { random: seeded(seed) })) {
    steps.push(step);
    if (steps.length >= count) break;
  }
  return steps;
}

/** Steps of the first phrase, from the first keystroke to the end of its hold. */
function firstPhrase(phrase: string, seed = 7): TypedStep[] {
  const steps = take([phrase, 'next'], 2000, seed);
  return steps.slice(0, steps.findIndex((step) => step.phase === 'holding') + 1);
}

const prefixes = (text: string) => Array.from(text, (_, i) => text.slice(0, i + 1));

describe('typedSteps', () => {
  it('types the first phrase one character at a time, ending on the full phrase', () => {
    const settled = firstPhrase('Hi there').filter((step) => step.phase === 'typing' && step.glyph === '');
    expect(settled.map((step) => step.text)).toEqual(prefixes('Hi there'));
    expect(settled.every((step) => step.phrase === 0)).toBe(true);
  });

  it('decodes every visible character through one or two glyphs before it settles', () => {
    const phrase = 'React · Next.js';
    const typing = firstPhrase(phrase).filter((step) => step.phase === 'typing');
    let decoded = 0;
    for (let i = 0; i < phrase.length; i++) {
      const before = phrase.slice(0, i);
      const glyphs = typing.filter((step) => step.text === before && step.glyph !== '').map((step) => step.glyph);
      if (phrase[i] === ' ') {
        expect(glyphs, `space at ${i}`).toEqual([]);
        continue;
      }
      decoded++;
      expect(glyphs.length, `char ${i}`).toBeGreaterThanOrEqual(1);
      expect(glyphs.length, `char ${i}`).toBeLessThanOrEqual(2);
      for (const glyph of glyphs) {
        expect(DECODE_GLYPHS).toContain(glyph);
        expect(glyph).not.toBe(phrase[i]);
      }
      glyphs.slice(1).forEach((glyph, j) => expect(glyph, `char ${i} flicker`).not.toBe(glyphs[j]));
    }
    expect(decoded).toBe(13);
  });

  it('keeps a human, irregular rhythm within the configured bounds', () => {
    const t = TYPED_TIMING;
    const typing = firstPhrase('Frontend, Backend y Mobile').filter((step) => step.phase === 'typing');
    const frames = typing.filter((step) => step.glyph !== '');
    const settles = typing.filter((step) => step.glyph === '' && !step.text.endsWith(' '));
    const spaces = typing.filter((step) => step.glyph === '' && step.text.endsWith(' '));
    for (const step of frames) {
      expect(step.duration).toBeGreaterThanOrEqual(t.frameMin);
      expect(step.duration).toBeLessThanOrEqual(t.frameMax);
    }
    for (const step of settles) {
      expect(step.duration).toBeGreaterThanOrEqual(t.typeMin);
      expect(step.duration).toBeLessThanOrEqual(t.typeMax);
    }
    for (const step of spaces) {
      expect(step.duration).toBeGreaterThanOrEqual(t.typeMin + t.wordPauseMin);
      expect(step.duration).toBeLessThanOrEqual(t.typeMax + t.wordPauseMax);
    }
    expect(new Set(settles.map((step) => step.duration)).size).toBeGreaterThan(5);
  });

  it('paints a phrase briskly: decode included, about 50ms per character on average', () => {
    const phrase = 'Technical Lead & Full-Stack Developer';
    for (const seed of [1, 7, 42]) {
      const typing = firstPhrase(phrase, seed).filter((step) => step.phase === 'typing');
      const perChar = typing.reduce((sum, step) => sum + step.duration, 0) / phrase.length;
      expect(perChar, `seed ${seed}`).toBeGreaterThanOrEqual(35);
      expect(perChar, `seed ${seed}`).toBeLessThanOrEqual(60);
    }
  });

  it('backspaces a long phrase in about half a second', () => {
    const phrase = 'Technical Lead & Full-Stack Developer';
    const steps = take([phrase, 'next'], 2000);
    const erase = steps.slice(
      steps.findIndex((step) => step.phase === 'holding') + 1,
      steps.findIndex((step) => step.phase === 'waiting'),
    );
    expect(erase).toHaveLength(phrase.length);
    const total = erase.reduce((sum, step) => sum + step.duration, 0);
    expect(total).toBeGreaterThanOrEqual(300);
    expect(total).toBeLessThanOrEqual(600);
  });

  it('holds the full phrase, then backspaces it with an accelerating key repeat', () => {
    const steps = take(['Hola mundo', 'next'], 2000);
    const hold = steps.findIndex((step) => step.phase === 'holding');
    expect(steps[hold]).toMatchObject({ text: 'Hola mundo', glyph: '', duration: TYPED_TIMING.hold, phrase: 0 });

    const erase = steps.slice(hold + 1, steps.findIndex((step) => step.phase === 'waiting'));
    expect(erase.every((step) => step.phase === 'erasing' && step.glyph === '')).toBe(true);
    expect(erase.map((step) => step.text)).toEqual(['Hola mund', ...prefixes('Hola mun').reverse(), '']);
    expect(erase[0].duration).toBe(TYPED_TIMING.eraseStart);
    erase.slice(1).forEach((step, i) => expect(step.duration).toBeLessThanOrEqual(erase[i].duration));
    expect(Math.min(...erase.map((step) => step.duration))).toBeGreaterThanOrEqual(TYPED_TIMING.eraseMin);
    expect(erase.at(-1)!.duration).toBeLessThan(erase[0].duration);
  });

  it('pauses on an empty line between phrases and loops back to the first one', () => {
    const steps = take(['ab', 'cd'], 400);
    const waits = steps.filter((step) => step.phase === 'waiting');
    expect(waits[0]).toMatchObject({ text: '', glyph: '', duration: TYPED_TIMING.gap, phrase: 0 });
    const order = steps.map((step) => step.phrase).filter((phrase, i, all) => i === 0 || all[i - 1] !== phrase);
    expect(order.slice(0, 4)).toEqual([0, 1, 0, 1]);
    const firstOfSecond = steps.find((step) => step.phrase === 1)!;
    expect(firstOfSecond).toMatchObject({ phase: 'typing', text: '' });
  });

  it('never splits a grapheme cluster', () => {
    const phrase = 'Diseño';
    const valid = new Set(['', 'D', 'Di', 'Dis', 'Dise', 'Diseñ', phrase]);
    for (const step of firstPhrase(phrase)) expect(valid.has(step.text), JSON.stringify(step.text)).toBe(true);
  });

  it('types a single phrase once and leaves it on screen', () => {
    const steps = take(['Solo'], 500);
    expect(steps.at(-1)).toMatchObject({ phase: 'holding', text: 'Solo' });
    expect(steps.some((step) => step.phase === 'erasing')).toBe(false);
  });

  it('yields nothing without phrases', () => {
    expect(take([], 10)).toEqual([]);
    expect(take(['', '   '], 10)).toEqual([]);
  });

  it('is deterministic for a given random source', () => {
    expect(take(['React · Next.js', 'AWS'], 300, 42)).toEqual(take(['React · Next.js', 'AWS'], 300, 42));
  });
});

describe('createTypedPlayer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const steps = (durations: number[]): Iterator<TypedStep> =>
    durations
      .map((duration, i): TypedStep => ({ phrase: 0, text: `s${i}`, glyph: '', phase: 'typing', duration }))
      [Symbol.iterator]();

  it('waits until every blocker is cleared before showing the first step', () => {
    vi.useFakeTimers();
    const render = vi.fn();
    const player = createTypedPlayer({ steps: steps([100, 100]), render, blockers: ['entrance', 'offscreen'] });
    vi.advanceTimersByTime(1000);
    player.unblock('entrance');
    vi.advanceTimersByTime(1000);
    expect(render).not.toHaveBeenCalled();
    player.unblock('offscreen');
    vi.advanceTimersByTime(0);
    expect(render.mock.calls.map(([step]) => step.text)).toEqual(['s0']);
  });

  it('shows each step for its own duration, in order', () => {
    vi.useFakeTimers();
    const render = vi.fn();
    createTypedPlayer({ steps: steps([100, 50, 30]), render });
    vi.advanceTimersByTime(0);
    expect(render).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(99);
    expect(render).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(render).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(50);
    expect(render.mock.calls.map(([step]) => step.text)).toEqual(['s0', 's1', 's2']);
  });

  it('freezes while blocked and resumes with the next step after a full dwell', () => {
    vi.useFakeTimers();
    const render = vi.fn();
    const player = createTypedPlayer({ steps: steps([100, 100, 100]), render });
    vi.advanceTimersByTime(50);
    player.block('hidden');
    vi.advanceTimersByTime(5000);
    expect(render).toHaveBeenCalledTimes(1);
    player.unblock('hidden');
    vi.advanceTimersByTime(99);
    expect(render).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(render.mock.calls.map(([step]) => step.text)).toEqual(['s0', 's1']);
  });

  it('ignores repeated blocks and unknown unblocks', () => {
    vi.useFakeTimers();
    const render = vi.fn();
    const player = createTypedPlayer({ steps: steps([100, 100]), render, blockers: ['offscreen'] });
    player.block('offscreen');
    player.unblock('hidden');
    vi.advanceTimersByTime(500);
    expect(render).not.toHaveBeenCalled();
    player.unblock('offscreen');
    vi.advanceTimersByTime(100);
    expect(render).toHaveBeenCalledTimes(2);
  });

  it('stops for good once disposed', () => {
    vi.useFakeTimers();
    const render = vi.fn();
    const player = createTypedPlayer({ steps: steps([100, 100, 100]), render });
    vi.advanceTimersByTime(0);
    player.dispose();
    player.unblock('anything');
    vi.advanceTimersByTime(1000);
    expect(render).toHaveBeenCalledTimes(1);
  });
});
