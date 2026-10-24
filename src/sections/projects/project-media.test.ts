import { describe, expect, it } from 'vitest';
import { PLACEHOLDER_SLOTS } from './project-media';

describe('PLACEHOLDER_SLOTS', () => {
  it('keeps the minimum layout of web and mobile details', () => {
    expect(PLACEHOLDER_SLOTS.web).toBe(4);
    expect(PLACEHOLDER_SLOTS.mobile).toBe(4);
  });

  it('never pads a backend detail with placeholders (its stack showcase fills the media block)', () => {
    expect(PLACEHOLDER_SLOTS.backend).toBe(0);
  });
});
