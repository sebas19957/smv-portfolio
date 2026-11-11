import { describe, expect, it } from 'vitest';
import {
  cellBoxes,
  countUpGlyphs,
  groupByBaseline,
  parseNameVariant,
  percentReadout,
  rollColumn,
  weightAxes,
  wordOrder,
} from './name-motion';

describe('parseNameVariant', () => {
  it('reads the variant from the query string', () => {
    expect(parseNameVariant('?name=a')).toBe('a');
    expect(parseNameVariant('?name=b')).toBe('b');
    expect(parseNameVariant('?foo=1&name=c')).toBe('c');
  });

  it('is forgiving about case and whitespace', () => {
    expect(parseNameVariant('?name=B')).toBe('b');
    expect(parseNameVariant('?name=%20c%20')).toBe('c');
  });

  it('falls back to "a" when the parameter is missing or unknown', () => {
    expect(parseNameVariant('')).toBe('a');
    expect(parseNameVariant('?name=')).toBe('a');
    expect(parseNameVariant('?name=z')).toBe('a');
    expect(parseNameVariant('?other=b')).toBe('a');
  });
});

describe('cellBoxes', () => {
  it('turns the kerned advances into em widths, so the cells rebuild the kerned line exactly', () => {
    const cells = cellBoxes([30, 33, 20], [30, 36, 20], 60);
    expect(cells.map((cell) => cell.width)).toEqual(['0.5em', '0.55em', '0.3333em']);
  });

  it('shifts a centred glyph back to where the kerned text put it', () => {
    // Natural advance 36px in a 33px cell: centring moves it 1.5px left, the shift moves it back.
    const [, kerned] = cellBoxes([30, 33], [30, 36], 60);
    expect(kerned.shift).toBe('0.025em');
    expect(cellBoxes([30], [30], 60)[0].shift).toBe('0em');
  });

  it('never returns NaN for a zero font size', () => {
    expect(cellBoxes([10], [12], 0)).toEqual([{ width: '0em', shift: '0em' }]);
  });
});

describe('groupByBaseline', () => {
  it('groups words that share a baseline into visual lines, in order', () => {
    expect(groupByBaseline([100, 100.4, 161, 161, 222], 4)).toEqual([[0, 1], [2, 3], [4]]);
  });

  it('returns no lines for no words', () => {
    expect(groupByBaseline([], 4)).toEqual([]);
  });
});

describe('percentReadout', () => {
  it('reads like the skill meters and the rail: three zero-padded digits and a percent sign', () => {
    expect(percentReadout(0)).toBe('000%');
    expect(percentReadout(0.07)).toBe('007%');
    expect(percentReadout(0.425)).toBe('043%');
    expect(percentReadout(1)).toBe('100%');
  });

  it('clamps out-of-range values', () => {
    expect(percentReadout(-0.2)).toBe('000%');
    expect(percentReadout(1.4)).toBe('100%');
  });
});

describe('countUpGlyphs', () => {
  it('counts up to the letter like a counter wheel: the letters right before it, in order', () => {
    expect(countUpGlyphs('e', 3)).toEqual(['b', 'c', 'd']);
    expect(countUpGlyphs('S', 2)).toEqual(['Q', 'R']);
  });

  it('wraps around the alphabet', () => {
    expect(countUpGlyphs('b', 3)).toEqual(['y', 'z', 'a']);
    expect(countUpGlyphs('A', 1)).toEqual(['Z']);
  });

  it('counts accented letters on their base letter', () => {
    expect(countUpGlyphs('á', 2)).toEqual(['y', 'z']);
    expect(countUpGlyphs('Ñ', 1)).toEqual(['M']);
  });

  it('has nothing to count for non-letters or no rows', () => {
    expect(countUpGlyphs('7', 3)).toEqual([]);
    expect(countUpGlyphs('e', 0)).toEqual([]);
  });
});

describe('rollColumn', () => {
  it('stacks the rolled glyphs top to bottom and ends on the target', () => {
    expect(rollColumn('', ['x', 'y'], 'a')).toBe(' \nx\ny\na');
    expect(rollColumn('a', ['x'], 'a')).toBe('a\nx\na');
  });
});

describe('wordOrder', () => {
  it('cycles through the words, one per re-roll', () => {
    expect([0, 1, 2, 3, 4].map((cycle) => wordOrder(cycle, 3))).toEqual([0, 1, 2, 0, 1]);
  });

  it('copes with a single word or none', () => {
    expect(wordOrder(5, 1)).toBe(0);
    expect(wordOrder(5, 0)).toBe(-1);
  });
});

describe('weightAxes', () => {
  it('rests at the heading weight and width', () => {
    expect(weightAxes(0)).toEqual({ weight: 620, stretch: 118 });
  });

  it('dips lighter and opens the width as the swell passes, so the glyph keeps its footprint', () => {
    const { weight, stretch } = weightAxes(1);
    expect(weight).toBeLessThan(620);
    expect(stretch).toBeGreaterThan(118);
    expect(stretch).toBeLessThanOrEqual(125);
  });

  it('interpolates and clamps', () => {
    const half = weightAxes(0.5);
    expect(half.weight).toBeLessThan(620);
    expect(half.weight).toBeGreaterThan(weightAxes(1).weight);
    expect(weightAxes(-1)).toEqual(weightAxes(0));
    expect(weightAxes(3)).toEqual(weightAxes(1));
  });
});
