import { SECTION_ORDER, type SectionId } from '../i18n';

export interface RailGroup {
  /** Section whose nav label names the word on the rail. */
  readonly label: SectionId;
  /** Page sections covered by the word, in document order (first one is the jump target). */
  readonly sections: readonly SectionId[];
}

/**
 * Scroll-rail words: exactly the navbar items, one per section, in nav order, so the rail and
 * the nav read identically and map 1:1 to the same anchors. The first word (the hero) is the
 * current heading from the top of the page.
 */
export const RAIL_GROUPS: readonly RailGroup[] = SECTION_ORDER.map((id) => ({ label: id, sections: [id] }));
