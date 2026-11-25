import { describe, expect, it } from 'vitest';
import { TECH } from '../../i18n';
import { profile } from '../../i18n/content/profile';
import {
  MAX_DRAWN_PX,
  MAX_ROUNDING_PX,
  pathPrecision,
  rawIcon,
  resolveBrandIcon,
  uniqueBrandIcons,
  type BrandIconRef,
} from './brand-icons';

const idsOf = (body: string) => [...body.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);

describe('pathPrecision', () => {
  it('keeps path rounding under the pixel budget at the largest size a logo is drawn', () => {
    for (const size of [16, 24, 32, 100, 128, 256, 300, 512, 1024]) {
      const roundingPx = (10 ** -pathPrecision(size) * MAX_DRAWN_PX) / size;
      expect(roundingPx, `viewBox ${size}`).toBeLessThanOrEqual(MAX_ROUNDING_PX);
    }
  });

  it('never rounds to whole units', () => {
    expect(pathPrecision(100_000)).toBe(1);
  });
});

describe('logo optimization', () => {
  it('shrinks heavy artwork', () => {
    const ref: BrandIconRef = { set: 'devicon', name: 'zustand' };

    expect(resolveBrandIcon(ref).body.length).toBeLessThan(rawIcon(ref).body.length * 0.85);
  });

  it('keeps every fill a logo recolours on dark backgrounds', () => {
    const refs: BrandIconRef[] = [...Object.values(TECH).map((tech) => tech.icon), ...profile.skills.map((skill) => skill.icon)];
    const recoloured = refs.filter((ref) => ref.dark && ref.dark !== 'invert');

    expect(recoloured.length).toBeGreaterThan(0);
    for (const ref of recoloured) {
      const { body } = resolveBrandIcon(ref);
      for (const color of ref.dark && ref.dark !== 'invert' ? ref.dark.recolor : []) {
        expect(body, `${ref.set}:${ref.name}`).toContain(`style="fill: var(--logo-ink, ${color})"`);
      }
    }
  });
});

describe('resolveBrandIcon', () => {
  it('gives every logo a stable, readable sprite id', () => {
    expect(resolveBrandIcon({ set: 'logos', name: 'react' }).id).toBe('brand-logos-react');
    expect(resolveBrandIcon({ set: 'simple-icons', name: 'astro' }).id).toBe('brand-simple-icons-astro');
  });

  it('resolves the same reference to the same id and body every time', () => {
    const ref: BrandIconRef = { set: 'logos', name: 'testing-library' };

    expect(resolveBrandIcon(ref)).toEqual(resolveBrandIcon(ref));
  });

  it('namespaces internal ids and every reference to them with the sprite id', () => {
    const icon = resolveBrandIcon({ set: 'logos', name: 'testing-library' });
    const ids = idsOf(icon.body);

    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) expect(id.endsWith(`-${icon.id}`)).toBe(true);
    for (const [, target] of icon.body.matchAll(/url\(#([^)]+)\)/g)) expect(ids).toContain(target);
  });

  it('rewrites internal href references too', () => {
    const icon = resolveBrandIcon({ set: 'logos', name: 'zod' });
    const ids = idsOf(icon.body);
    const hrefs = [...icon.body.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);

    expect(hrefs.length).toBeGreaterThan(0);
    for (const target of hrefs) expect(ids).toContain(target);
  });

  it('keeps a recoloured variant apart from the plain mark', () => {
    const plain = resolveBrandIcon({ set: 'logos', name: 'expo-icon', dark: 'invert' });
    const recolored = resolveBrandIcon({ set: 'logos', name: 'expo-icon', dark: { recolor: ['#000020'] } });

    expect(recolored.id).not.toBe(plain.id);
    expect(recolored.body).toContain('style="fill: var(--logo-ink, #000020)"');
    expect(plain.body).not.toContain('--logo-ink');
  });
});

describe('uniqueBrandIcons', () => {
  it('resolves each logo variant once, in first-use order', () => {
    const icons = uniqueBrandIcons([
      { set: 'logos', name: 'react' },
      { set: 'logos', name: 'expo-icon', dark: 'invert' },
      { set: 'logos', name: 'react' },
      { set: 'logos', name: 'expo-icon', dark: { recolor: ['#000020'] } },
      { set: 'logos', name: 'expo-icon', dark: 'invert', optical: 0.9 },
    ]);

    expect(icons.map((icon) => icon.id)).toEqual([
      'brand-logos-react',
      'brand-logos-expo-icon',
      resolveBrandIcon({ set: 'logos', name: 'expo-icon', dark: { recolor: ['#000020'] } }).id,
    ]);
  });
});
