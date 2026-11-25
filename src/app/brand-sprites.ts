import { PROJECTS, TECH, type ProjectEntry, type TechChip } from '../i18n';
import { profile } from '../i18n/content/profile';
import { SITE_STACK } from '../sections/footer/colophon';
import { cardChips, stackGroups, stackLogos } from '../sections/projects/project-stack';
import { resolveBrandIcon, type BrandIconRef } from '../shared/ui/brand-icons';

/**
 * Which brand logos each document defines. The portfolio page's sprite holds every logo the page
 * renders; a project sheet fragment adds only the logos of its stack the page lacks, so the page
 * stays light and a mounted sheet never redefines an id. `BrandLogo` fails the build if it draws a
 * logo its document does not define, so these lists cannot silently drift from the markup.
 */

const chipIcons = (chips: readonly TechChip[]): BrandIconRef[] => chips.flatMap((chip) => (chip.tech ? [TECH[chip.tech].icon] : []));

/** Logos the portfolio page renders outside the project sheets. */
export function pageBrandIcons(): BrandIconRef[] {
  return [
    ...profile.socials.map((social) => social.icon),
    ...profile.skills.map((skill) => skill.icon),
    ...chipIcons(profile.experience.flatMap((fact): readonly TechChip[] => fact.tech)),
    ...chipIcons(SITE_STACK),
    ...PROJECTS.flatMap((entry) => [
      ...chipIcons(cardChips(entry)),
      // Backend cards show their stack as a logo cover (see ProjectCard).
      ...(entry.kind === 'backend' ? stackLogos(entry).map((tech) => TECH[tech].icon) : []),
    ]),
  ];
}

/** Logos one project's sheet renders (its stack, as chips or as the backend showcase). */
export function sheetBrandIcons(entry: Pick<ProjectEntry, 'stack'>): BrandIconRef[] {
  return chipIcons(stackGroups(entry).flatMap((group) => group.items));
}

/** The sheet's logos missing from the page sprite, once each: what its fragment must define. */
export function sheetOnlyBrandIcons(entry: Pick<ProjectEntry, 'stack'>): BrandIconRef[] {
  const page = new Set(pageBrandIcons().map((ref) => resolveBrandIcon(ref).id));
  const own = new Map<string, BrandIconRef>();
  for (const ref of sheetBrandIcons(entry)) {
    const { id } = resolveBrandIcon(ref);
    if (!page.has(id) && !own.has(id)) own.set(id, ref);
  }
  return [...own.values()];
}
