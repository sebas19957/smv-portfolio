import type { RichText } from '../../i18n/types';
import { graphemes } from '../../shared/lib/graphemes';

/**
 * Hero name model: the build-time split into words and letters. Letters render as inline spans
 * (kerning intact); the motion locks them into fixed cells at run time (see `name-motion.ts`).
 */

export interface NameWord {
  readonly text: string;
  /** Part of the accent run (painted in the accent ink). */
  readonly accent: boolean;
  /** True when the source had whitespace before this word on the same line. */
  readonly spaceBefore: boolean;
  readonly chars: readonly string[];
}

export type NameLine = readonly NameWord[];

export function splitName(lines: readonly RichText[]): NameLine[] {
  return lines.map((line) => {
    const words: NameWord[] = [];
    let pendingSpace = false;
    for (const part of line) {
      const accent = typeof part !== 'string';
      const text = typeof part === 'string' ? part : part.accent;
      for (const token of text.split(/(\s+)/)) {
        if (!token) continue;
        if (/^\s+$/.test(token)) {
          pendingSpace = true;
          continue;
        }
        words.push({ text: token, accent, spaceBefore: pendingSpace && words.length > 0, chars: graphemes(token) });
        pendingSpace = false;
      }
    }
    return words;
  });
}

/** The name as one plain string (accessible name of the heading). */
export function nameText(lines: readonly RichText[]): string {
  return splitName(lines)
    .map((line) => line.map((word) => (word.spaceBefore ? ` ${word.text}` : word.text)).join(''))
    .filter(Boolean)
    .join(' ');
}
