/**
 * Build-time brand/tool logo resolver (inlined as SVG, nothing fetched at runtime).
 *
 * Sources, in order of preference:
 * - `@iconify-json/logos` (CC0, gilbarbara/logos): official full-colour logos.
 * - `@iconify-json/devicon` (MIT): Devicon "original" colour logos where `logos` has no entry
 *   (Microsoft SQL Server) or for the classic red Angular shield.
 * - `@iconify-json/selfhst` (CC BY 4.0, selfh.st/icons): Odoo's official mark, missing elsewhere.
 * - `@iconify-json/simple-icons` (CC0): official single-colour marks (e.g. shadcn/ui), drawn in ink.
 * - `@iconify-json/tabler` (MIT): outline pictograms, tinted with the skill's category colour,
 *   for practices that have no official logo (AI skills, REST, CI/CD).
 *
 * Every logo is cropped to its measured content bounds (`brand-icon-bounds.ts`) so different
 * aspect ratios and built-in padding can be normalised to the same optical size.
 */
import { icons as devicon } from '@iconify-json/devicon';
import { icons as logos } from '@iconify-json/logos';
import { icons as selfhst } from '@iconify-json/selfhst';
import { icons as simpleIcons } from '@iconify-json/simple-icons';
import { icons as tabler } from '@iconify-json/tabler';
import { ICON_BOUNDS } from './brand-icon-bounds';

export type BrandIconRef = (
  | { readonly set: 'logos'; readonly name: string }
  | { readonly set: 'devicon'; readonly name: string }
  | { readonly set: 'tabler'; readonly name: string }
  | { readonly set: 'selfhst'; readonly name: string }
  | { readonly set: 'simple-icons'; readonly name: string }
) & {
  /**
   * Official light variant on dark backgrounds: `invert` for black marks (Next.js, GitHub),
   * or the dark colours to repaint white (e.g. the AWS wordmark) while keeping the rest.
   */
  readonly dark?: 'invert' | { readonly recolor: readonly string[] };
  /** Pictogram tinted with the skill's category colour instead of an official palette. */
  readonly tint?: boolean;
  /**
   * Optical correction on top of the equal-area sizing: solid tiles read heavier (< 1),
   * thin line marks read lighter (> 1). Defaults to 1.
   */
  readonly optical?: number;
};

export interface ResolvedIcon {
  /** Content-cropped viewBox. */
  readonly viewBox: string;
  readonly body: string;
  /** Content width / height. */
  readonly aspect: number;
  readonly invertOnDark: boolean;
  readonly tint: boolean;
  readonly optical: number;
}

type IconSet = typeof logos;

const SETS: Record<BrandIconRef['set'], IconSet> = { logos, devicon, tabler, selfhst, 'simple-icons': simpleIcons };

/** Unique ids per inlined copy, so gradients/masks of repeated logos never collide. */
let instance = 0;

export function iconKey(ref: Pick<BrandIconRef, 'set' | 'name'>): string {
  return `${ref.set}:${ref.name}`;
}

export function rawIcon(ref: Pick<BrandIconRef, 'set' | 'name'>): { body: string; width: number; height: number } {
  const set = SETS[ref.set];
  const icon = set.icons[ref.name];
  if (!icon) throw new Error(`Missing icon "${iconKey(ref)}"`);
  return { body: icon.body, width: icon.width ?? set.width ?? 16, height: icon.height ?? set.height ?? 16 };
}

export function resolveBrandIcon(ref: BrandIconRef): ResolvedIcon {
  const raw = rawIcon(ref);
  const bounds = ICON_BOUNDS[iconKey(ref)];
  if (!bounds) throw new Error(`Missing measured bounds for "${iconKey(ref)}" (re-run the bounds script)`);
  const [x, y, w, h] = bounds;

  let body = raw.body;
  // Namespace internal ids (gradients, masks, clip paths).
  const suffix = `-i${++instance}`;
  const ids = [...body.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) {
    body = body
      .replaceAll(`id="${id}"`, `id="${id}${suffix}"`)
      .replaceAll(`url(#${id})`, `url(#${id}${suffix})`)
      .replaceAll(`href="#${id}"`, `href="#${id}${suffix}"`);
  }
  if (ref.dark && ref.dark !== 'invert') {
    for (const color of ref.dark.recolor) {
      body = body.replaceAll(`fill="${color}"`, `fill="${color}" style="fill: var(--logo-ink, ${color})"`);
    }
  }
  return {
    viewBox: `${x} ${y} ${w} ${h}`,
    body,
    aspect: w / h,
    invertOnDark: ref.dark === 'invert',
    tint: ref.tint ?? false,
    optical: ref.optical ?? 1,
  };
}
