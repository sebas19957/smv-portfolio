/**
 * Pure helpers of the hero name motion (no DOM): variant selection, the fixed letter cells that
 * rebuild the kerned line, line grouping, the percent readout, the odometer columns and the weight
 * axes.
 */

export const NAME_VARIANTS = ['a', 'b', 'c'] as const;
export type NameVariant = (typeof NAME_VARIANTS)[number];

/** Reads `?name=a|b|c` (case and whitespace forgiven); anything else is the default "a". */
export function parseNameVariant(search: string): NameVariant {
  const value = new URLSearchParams(search).get('name')?.trim().toLowerCase();
  return (NAME_VARIANTS as readonly string[]).includes(value ?? '') ? (value as NameVariant) : 'a';
}

const em = (px: number, fontSize: number): string => `${fontSize > 0 ? Math.round((px / fontSize) * 1e4) / 1e4 : 0}em`;

export interface CellBox {
  /** Cell width: the letter's kerned advance, so the cells add up to the kerned line. */
  readonly width: string;
  /** Offset that moves the centred glyph (its natural advance) back to its kerned position. */
  readonly shift: string;
}

/**
 * Fixed letter cells that reproduce the kerned inline layout. Each cell is as wide as the letter's
 * advance in context (kerning included) and centres its glyph; the shift cancels that centring so
 * at rest every glyph sits exactly where the kerned text put it. In em, so breakpoints keep it.
 */
export function cellBoxes(kerned: readonly number[], natural: readonly number[], fontSize: number): CellBox[] {
  return kerned.map((width, i) => ({
    width: em(width, fontSize),
    shift: em(((natural[i] ?? width) - width) / 2, fontSize),
  }));
}

/** Groups word indices that share a baseline (within `tolerance` px) into visual lines, in order. */
export function groupByBaseline(baselines: readonly number[], tolerance: number): number[][] {
  const lines: number[][] = [];
  let anchor = Number.NaN;
  baselines.forEach((baseline, i) => {
    if (lines.length && Math.abs(baseline - anchor) <= tolerance) {
      lines[lines.length - 1].push(i);
      return;
    }
    anchor = baseline;
    lines.push([i]);
  });
  return lines;
}

/** "043%": three zero-padded digits like the skill meters and the page rail. */
export function percentReadout(fraction: number): string {
  const value = Math.round(Math.min(1, Math.max(0, fraction)) * 100);
  return `${String(value).padStart(3, '0')}%`;
}

/**
 * The `count` letters a counter wheel shows right before `letter`, in order (wrapping around the
 * alphabet; accented letters count on their base letter). Empty for anything that is not a letter.
 */
export function countUpGlyphs(letter: string, count: number): string[] {
  const base = letter.normalize('NFD').charAt(0);
  const upper = base >= 'A' && base <= 'Z';
  if (!upper && !(base >= 'a' && base <= 'z')) return [];
  const start = (upper ? 'A' : 'a').charCodeAt(0);
  const index = base.charCodeAt(0) - start;
  return Array.from({ length: Math.max(0, count) }, (_, i) =>
    String.fromCharCode(start + ((((index - count + i) % 26) + 26) % 26)),
  );
}

/** One odometer column, top to bottom (an empty start row is a no-break space so it keeps its line). */
export function rollColumn(from: string, glyphs: readonly string[], target: string): string {
  return [from || ' ', ...glyphs, target].join('\n');
}

/** Which word re-rolls on a given idle cycle (-1 when there is none). */
export function wordOrder(cycle: number, count: number): number {
  return count > 0 ? cycle % count : -1;
}

/** Heading axes (system.css `.heading-xl`) and the light end of the weight swell. */
export const WEIGHT_REST = { weight: 620, stretch: 118 } as const;
export const WEIGHT_DIP = { weight: 380, stretch: 125 } as const;

/**
 * Axes of a letter as the swell passes (0 = at rest, 1 = deepest): it turns lighter while the width
 * opens toward the face's widest, so the glyph keeps roughly its footprint inside its cell.
 */
export function weightAxes(dip: number): { weight: number; stretch: number } {
  const t = Math.min(1, Math.max(0, dip));
  const lerp = (a: number, b: number) => Math.round((a + (b - a) * t) * 100) / 100;
  return { weight: lerp(WEIGHT_REST.weight, WEIGHT_DIP.weight), stretch: lerp(WEIGHT_REST.stretch, WEIGHT_DIP.stretch) };
}
