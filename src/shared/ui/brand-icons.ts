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
 *
 * Bodies are optimized with SVGO at build time (this module only runs while prerendering), with
 * path coordinates rounded only as far as stays invisible at the largest size a logo is drawn.
 */
import { icons as devicon } from '@iconify-json/devicon';
import { icons as logos } from '@iconify-json/logos';
import { icons as selfhst } from '@iconify-json/selfhst';
import { icons as simpleIcons } from '@iconify-json/simple-icons';
import { icons as tabler } from '@iconify-json/tabler';
import { optimize } from 'svgo';
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
  /**
   * Sprite id, stable per logo variant (set, name and recolouring): the body is emitted once in
   * the page's sprite (`BrandIconSprite`) and every `BrandLogo` draws it through `<use>`.
   */
  readonly id: string;
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

export function iconKey(ref: Pick<BrandIconRef, 'set' | 'name'>): string {
  return `${ref.set}:${ref.name}`;
}

export function rawIcon(ref: Pick<BrandIconRef, 'set' | 'name'>): { body: string; width: number; height: number } {
  const set = SETS[ref.set];
  const icon = set.icons[ref.name];
  if (!icon) throw new Error(`Missing icon "${iconKey(ref)}"`);
  return { body: icon.body, width: icon.width ?? set.width ?? 16, height: icon.height ?? set.height ?? 16 };
}

/** Largest size a logo is drawn at, in CSS px (stack-cover tiles: ≈51px, ≈54px on hover). */
export const MAX_DRAWN_PX = 64;
/** Largest shift path rounding may cause at that size, in CSS px (invisible even at 3x). */
export const MAX_ROUNDING_PX = 0.01;

/** Decimals kept in path data for a logo whose content spans `size` viewBox units. */
export function pathPrecision(size: number): number {
  return Math.max(1, Math.ceil(-Math.log10((MAX_ROUNDING_PX * size) / MAX_DRAWN_PX)));
}

const optimized = new Map<string, string>();

/** The icon body after SVGO (memoized: every logo is resolved many times per build). */
function optimizedBody(ref: Pick<BrandIconRef, 'set' | 'name'>, contentSize: number): string {
  const key = iconKey(ref);
  const cached = optimized.get(key);
  if (cached !== undefined) return cached;
  const raw = rawIcon(ref);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${raw.width} ${raw.height}">${raw.body}</svg>`;
  const { data } = optimize(svg, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // Ids are namespaced per sprite entry below; keep them readable and stable.
            cleanupIds: false,
            convertPathData: { floatPrecision: pathPrecision(contentSize) },
          },
        },
      },
    ],
  });
  const body = data.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  optimized.set(key, body);
  return body;
}

export function resolveBrandIcon(ref: BrandIconRef): ResolvedIcon {
  const bounds = ICON_BOUNDS[iconKey(ref)];
  if (!bounds) throw new Error(`Missing measured bounds for "${iconKey(ref)}" (re-run the bounds script)`);
  const [x, y, w, h] = bounds;
  const recolor = ref.dark && ref.dark !== 'invert' ? ref.dark.recolor : [];
  const spriteId = ['brand', ref.set, ref.name, ...recolor.map((color) => color.replace('#', ''))].join('-');

  let body = optimizedBody(ref, Math.max(w, h));
  // Namespace internal ids (gradients, masks, clip paths) per variant, so logos never collide in the sprite.
  const suffix = `-${spriteId}`;
  const ids = [...body.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) {
    body = body
      .replaceAll(`id="${id}"`, `id="${id}${suffix}"`)
      .replaceAll(`url(#${id})`, `url(#${id}${suffix})`)
      .replaceAll(`href="#${id}"`, `href="#${id}${suffix}"`);
  }
  for (const color of recolor) {
    body = body.replaceAll(`fill="${color}"`, `fill="${color}" style="fill: var(--logo-ink, ${color})"`);
  }
  return {
    id: spriteId,
    viewBox: `${x} ${y} ${w} ${h}`,
    body,
    aspect: w / h,
    invertOnDark: ref.dark === 'invert',
    tint: ref.tint ?? false,
    optical: ref.optical ?? 1,
  };
}

/** Resolves every distinct logo variant once, in first-use order (the sprite's contents). */
export function uniqueBrandIcons(refs: readonly BrandIconRef[]): ResolvedIcon[] {
  const icons = new Map<string, ResolvedIcon>();
  for (const ref of refs) {
    const icon = resolveBrandIcon(ref);
    if (!icons.has(icon.id)) icons.set(icon.id, icon);
  }
  return [...icons.values()];
}
