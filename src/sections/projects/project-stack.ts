import {
  STACK_ORDER,
  TECH,
  type ProjectEntry,
  type StackGroup,
  type TechChip,
  type TechId,
  type TechRef,
} from '../../i18n';

/** Logos on a backend card: two rows of four fit the 16:10 cell at every breakpoint. */
export const CARD_LOGO_LIMIT = 8;

/** Resolves a stack item to a chip (label + optional logo id). */
export function toChip(ref: TechRef): TechChip {
  if (typeof ref === 'string') return { label: TECH[ref].label, tech: ref };
  return ref.tech ? { label: ref.label, tech: ref.tech } : { label: ref.label };
}

/** The card's 4–6 chips: the curated list, or the first six stack items. */
export function cardChips(entry: ProjectEntry): TechChip[] {
  const refs = entry.chips ?? STACK_ORDER.flatMap((group) => entry.stack[group] ?? []).slice(0, 6);
  return refs.map(toChip);
}

/** Non-empty stack groups in `STACK_ORDER`, resolved to chips. */
export function stackGroups(entry: Pick<ProjectEntry, 'stack'>): { group: StackGroup; items: TechChip[] }[] {
  return STACK_ORDER.flatMap((group) => {
    const refs = entry.stack[group];
    return refs?.length ? [{ group, items: refs.map(toChip) }] : [];
  });
}

/** Distinct technologies with an official logo across the whole stack, in stack order. */
export function stackLogos(entry: Pick<ProjectEntry, 'stack'>, limit = CARD_LOGO_LIMIT): TechId[] {
  const ids = STACK_ORDER.flatMap((group) => entry.stack[group] ?? []).flatMap((ref) => toChip(ref).tech ?? []);
  return [...new Set(ids)].slice(0, limit);
}
