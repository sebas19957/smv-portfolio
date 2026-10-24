import { en } from './content/en';
import { es } from './content/es';
import { profile } from './content/profile';
import type { Locale } from './locales';
import type { LocalizedCopy, Profile, SectionId } from './types';

export * from './locales';
export { TECH } from './content/tech';
export type { TechChip, TechId } from './content/tech';
export { PRODUCTS, PROJECTS, STACK_ORDER } from './content/projects';
export type * from './types';

const COPY: Record<Locale, LocalizedCopy> = { en, es };

export interface PortfolioContent {
  readonly locale: Locale;
  readonly copy: LocalizedCopy;
  readonly profile: Profile;
}

export function getContent(locale: Locale): PortfolioContent {
  return { locale, copy: COPY[locale], profile };
}

/** Page sections in document order; drives the nav, the scroll rail and the eyebrow indices. */
export const SECTION_ORDER: readonly SectionId[] = [
  'home',
  'about',
  'skills',
  'resume',
  'projects',
  'testimonials',
  'philosophy',
  'contact',
];

/** "01", "02", … for eyebrows, badges and indices. */
export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function sectionIndex(id: SectionId): string {
  return pad2(SECTION_ORDER.indexOf(id) + 1);
}
