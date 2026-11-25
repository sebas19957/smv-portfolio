// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { REVEAL_FROM, revealFrom } from './reveal';

describe('revealFrom', () => {
  it('hides regular blocks with autoAlpha, keeping them out of the tab order until revealed', () => {
    expect(revealFrom(document.createElement('div'))).toBe(REVEAL_FROM);
    expect(revealFrom(document.createElement('p'))).toBe(REVEAL_FROM);
  });

  it('hides headings with opacity only, so the outline stays complete for assistive tech while they wait', () => {
    for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
      const from = revealFrom(document.createElement(tag));

      expect(from, tag).not.toHaveProperty('autoAlpha');
      expect(from, tag).not.toHaveProperty('visibility');
      expect(from, tag).toEqual({ ...withoutAutoAlpha(REVEAL_FROM), opacity: 0 });
    }
  });
});

function withoutAutoAlpha(vars: gsap.TweenVars): gsap.TweenVars {
  const { autoAlpha: _autoAlpha, ...rest } = vars;
  return rest;
}
