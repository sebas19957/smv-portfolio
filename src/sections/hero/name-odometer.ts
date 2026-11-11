import gsap from 'gsap';
import type { NameContext, NameMotion } from './hero-name';
import { countUpGlyphs, rollColumn, wordOrder } from './name-motion';

/**
 * Variant "b" timing (s). The entrance lands like the rail's counter digits (fast out, long settle);
 * the idle re-roll is an even ease in and out, so the word turns over smoothly and comes to rest.
 */
export const ODOMETER = {
  /** Entrance: letters a wheel counts through before landing, duration, stagger, extra gap per word. */
  rows: 3,
  roll: 0.95,
  rollStagger: 0.045,
  wordGap: 0.1,
  ease: 'expo.out',
  /** Idle turn of one word: full turns of each wheel, duration, stagger, rest between words. */
  idleTurns: 1,
  idleRoll: 0.9,
  idleStagger: 0.065,
  idleEase: 'power3.inOut',
  rest: 3.8,
} as const;

/**
 * Variant "b", odometer. Each letter sits in its cell like a counter wheel (the page rail's odometer
 * readout, set in the display face) and counts up into place through the letters right before it;
 * the landing travels across the name as a narrow front, so only a few wheels move at once. Once
 * settled, every few seconds one word turns over: each wheel makes one clean turn (only the letter
 * itself is on it, so nothing else ever shows), one after another, cycling the words.
 */
export function createOdometer(ctx: NameContext): NameMotion {
  const { words, chars } = ctx;
  const letterOf = (char: HTMLElement) => char.textContent ?? '';
  const lettersOf = (word: HTMLElement | undefined) => Array.from(word?.querySelectorAll<HTMLElement>('.name__char') ?? []);

  const settle = (char: HTMLElement) => {
    delete char.dataset.roll;
    char.style.removeProperty('--roll');
  };

  // ---- Entrance: every letter starts on an empty row and counts up to itself ----
  const entrance = gsap.timeline({ paused: true });
  let index = 0;
  words.forEach((word, w) => {
    lettersOf(word).forEach((char) => {
      const glyphs = countUpGlyphs(letterOf(char), ODOMETER.rows);
      char.dataset.roll = rollColumn('', glyphs, letterOf(char));
      gsap.set(char, { '--roll': 0 });
      entrance.to(
        char,
        { '--roll': glyphs.length + 1, duration: ODOMETER.roll, ease: ODOMETER.ease, onComplete: () => settle(char) },
        index * ODOMETER.rollStagger + w * ODOMETER.wordGap,
      );
      index++;
    });
  });

  // ---- Constant life: one word re-rolls, then a rest, cycling the words ----
  let cycle = 0;
  let current: gsap.core.Timeline | null = null;
  let wait: gsap.core.Tween | null = null;
  let running = false;

  const reroll = () => {
    wait = null;
    const tl = gsap.timeline({
      onComplete: () => {
        current = null;
        cycle++;
        if (running) wait = gsap.delayedCall(ODOMETER.rest, reroll);
      },
    });
    lettersOf(words[wordOrder(cycle, words.length)]).forEach((char, j) => {
      const letter = letterOf(char);
      const glyphs = Array.from({ length: ODOMETER.idleTurns - 1 }, () => letter);
      const at = j * ODOMETER.idleStagger;
      tl.call(() => {
        char.dataset.roll = rollColumn(letter, glyphs, letter);
        gsap.set(char, { '--roll': 0 });
      }, undefined, at);
      tl.to(char, { '--roll': glyphs.length + 1, duration: ODOMETER.idleRoll, ease: ODOMETER.idleEase, onComplete: () => settle(char) }, at);
    });
    current = tl;
  };

  const setRunning = (run: boolean) => {
    running = run;
    if (run) {
      if (current) current.resume();
      else if (wait) wait.resume();
      else wait = gsap.delayedCall(ODOMETER.rest * 0.6, reroll);
    } else {
      current?.pause();
      wait?.pause();
    }
  };

  return {
    entrance,
    setRunning,
    dispose: () => {
      entrance.kill();
      current?.kill();
      wait?.kill();
      chars.forEach(settle);
    },
  };
}
