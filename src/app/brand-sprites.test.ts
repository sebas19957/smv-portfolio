import { describe, expect, it } from 'vitest';
import { PROJECTS, TECH, getContent } from '../i18n';
import { SITE_STACK } from '../sections/footer/colophon';
import { cardChips, stackGroups, stackLogos } from '../sections/projects/project-stack';
import { resolveBrandIcon, type BrandIconRef } from '../shared/ui/brand-icons';
import { pageBrandIcons, sheetBrandIcons, sheetOnlyBrandIcons } from './brand-sprites';

const ids = (refs: readonly BrandIconRef[]) => new Set(refs.map((ref) => resolveBrandIcon(ref).id));
const idOf = (ref: BrandIconRef) => resolveBrandIcon(ref).id;

describe('pageBrandIcons', () => {
  const page = ids(pageBrandIcons());
  const { profile } = getContent('en');

  it('covers the socials and the skills grid', () => {
    for (const social of profile.socials) expect(page).toContain(idOf(social.icon));
    for (const skill of profile.skills) expect(page).toContain(idOf(skill.icon));
  });

  it('covers the experience chips and the colophon stack', () => {
    for (const chip of [...profile.experience.flatMap((fact) => fact.tech), ...SITE_STACK]) {
      if (chip.tech) expect(page).toContain(idOf(TECH[chip.tech].icon));
    }
  });

  it('covers every project card: its chips, and the stack cover of backend cards', () => {
    for (const entry of PROJECTS) {
      const techs = [...cardChips(entry).flatMap((chip) => chip.tech ?? []), ...(entry.kind === 'backend' ? stackLogos(entry) : [])];
      for (const tech of techs) expect(page, `${entry.slug}: ${tech}`).toContain(idOf(TECH[tech].icon));
    }
  });
});

describe('sheetBrandIcons', () => {
  it('covers every logo of the project stack (side chips or backend showcase)', () => {
    for (const entry of PROJECTS) {
      const sheet = ids(sheetBrandIcons(entry));
      for (const item of stackGroups(entry).flatMap((group) => group.items)) {
        if (item.tech) expect(sheet, `${entry.slug}: ${item.tech}`).toContain(idOf(TECH[item.tech].icon));
      }
    }
  });
});

describe('sheetOnlyBrandIcons', () => {
  const page = ids(pageBrandIcons());

  it('keeps only the sheet logos the page sprite lacks, once each', () => {
    for (const entry of PROJECTS) {
      const own = sheetOnlyBrandIcons(entry).map(idOf);
      expect(new Set(own).size).toBe(own.length);
      for (const id of own) expect(page).not.toContain(id);
      for (const id of ids(sheetBrandIcons(entry))) expect(page.has(id) || own.includes(id)).toBe(true);
    }
  });

  it('moves some logos out of the page sprite', () => {
    expect(PROJECTS.some((entry) => sheetOnlyBrandIcons(entry).length > 0)).toBe(true);
  });
});
