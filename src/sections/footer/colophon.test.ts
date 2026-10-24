import { describe, expect, it } from 'vitest';
import { TECH } from '../../i18n';
import { ARTCRAFT_URL, SITE_STACK, splitLinkSlot } from './colophon';

describe('site stack', () => {
  it('lists a short, unique stack of known technologies', () => {
    expect(SITE_STACK.length).toBeGreaterThanOrEqual(6);
    expect(SITE_STACK.length).toBeLessThanOrEqual(10);
    expect(new Set(SITE_STACK.map((chip) => chip.label)).size).toBe(SITE_STACK.length);
    for (const chip of SITE_STACK) if (chip.tech) expect(TECH[chip.tech], chip.label).toBeDefined();
  });
});

describe('splitLinkSlot', () => {
  it('splits a template around its {link} slot', () => {
    expect(splitLinkSlot('Inspired by {link}. Thanks.')).toEqual(['Inspired by ', '. Thanks.']);
  });

  it('throws when the slot is missing', () => {
    expect(() => splitLinkSlot('No slot here')).toThrow();
  });
});

it('credits Artcraft at its apps page', () => {
  expect(ARTCRAFT_URL).toBe('https://getartcraft.com/apps');
});
