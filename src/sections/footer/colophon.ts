import type { TechChip } from '../../i18n';

/** Where the design credit points. */
export const ARTCRAFT_URL = 'https://getartcraft.com/apps';

/**
 * The portfolio's own stack, as declared in the repo: package.json (framework, Node adapter,
 * Redis client, mailer, animation and test libraries), the Dockerfile and the GitHub workflows.
 * GSAP (whose only mark is its own wordmark) and Lenis (no logo in the bundled icon sets) render
 * as plain chips.
 */
export const SITE_STACK: readonly TechChip[] = [
  { label: 'Astro', tech: 'astro' },
  { label: 'TypeScript', tech: 'typescript' },
  { label: 'Node.js', tech: 'nodejs' },
  { label: 'Redis', tech: 'redis' },
  { label: 'Nodemailer', tech: 'nodemailer' },
  { label: 'GSAP' },
  { label: 'Lenis' },
  { label: 'Vitest', tech: 'vitest' },
  { label: 'Docker', tech: 'docker' },
  { label: 'GitHub Actions', tech: 'githubActions' },
];

/** Splits a copy template around its single `{link}` slot. */
export function splitLinkSlot(template: string): readonly [string, string] {
  const parts = template.split('{link}');
  if (parts.length !== 2) throw new Error(`Expected exactly one {link} slot in "${template}"`);
  return [parts[0], parts[1]];
}
