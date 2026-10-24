import type { AccentKey, SectionId } from '../i18n';

/**
 * Vivid fill (`--app`) of each section title's highlighted word, from the per-item palette in
 * styles/tokens.css. These are ~60px display headings, so the bar is WCAG large-text 3:1 on both
 * themes; only the fills that pass it on #f2f1ee and #121316 are used (amber, teal, orange, lime,
 * mint, cyan and sky fall under 3:1 on the light background). The hero name keeps the
 * reference's global accent ink.
 */
export const SECTION_ACCENTS: Readonly<Record<Exclude<SectionId, 'home'>, AccentKey>> = {
  about: 'vermilion', // 3.17 light · 5.19 dark
  skills: 'indigo', // 3.83 · 4.30
  resume: 'green', // 3.09 · 5.32
  projects: 'violet', // 3.75 · 4.39
  testimonials: 'magenta', // 3.65 · 4.51
  // On its own coloured ground the section repaints the run (see PhilosophySection).
  philosophy: 'violet',
  contact: 'blue', // 3.53 · 4.66
};
