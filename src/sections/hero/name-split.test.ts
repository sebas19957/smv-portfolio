import { describe, expect, it } from 'vitest';
import { profile } from '../../i18n/content/profile';
import { nameText, splitName } from './name-split';

describe('splitName', () => {
  it('splits each line into words and keeps the accent run', () => {
    const lines = splitName([['Sebastián'], ['Mosquera ', { accent: 'Valencia' }]]);
    expect(lines.map((line) => line.map((word) => [word.text, word.accent, word.spaceBefore]))).toEqual([
      [['Sebastián', false, false]],
      [
        ['Mosquera', false, false],
        ['Valencia', true, true],
      ],
    ]);
  });

  it('splits words into graphemes, keeping combining marks on their letter', () => {
    const [[word]] = splitName([['Sebastián']]);
    expect(word.chars).toEqual(['S', 'e', 'b', 'a', 's', 't', 'i', 'á', 'n']);
  });

  it('splits multi-word runs and glued runs without inventing spaces', () => {
    const [line] = splitName([['Ana  María', { accent: 'Gómez' }]]);
    expect(line.map((word) => [word.text, word.spaceBefore])).toEqual([
      ['Ana', false],
      ['María', true],
      ['Gómez', false],
    ]);
  });
});

describe('nameText', () => {
  it('reads the full name with single spaces between lines and words', () => {
    expect(nameText(profile.nameLines)).toBe('Sebastián Mosquera Valencia');
    expect(nameText([['  Ana '], ['María', { accent: 'Gómez' }]])).toBe('Ana MaríaGómez');
  });
});
