import { STACK_ORDER, TECH, type ProjectEntry, type TechChip, type TechRef } from '../../i18n';

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
