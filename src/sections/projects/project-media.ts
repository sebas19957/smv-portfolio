import type { ImageMetadata } from 'astro';
import type { ProjectKind } from '../../i18n';

/**
 * Project images, auto-loaded from `src/assets/projects/<slug>/` at build time:
 * `cover.*` feeds the card, `01.*`, `02.*` … (ordered by file name) feed the detail gallery.
 * When the card image is one of the gallery shots, there is no `cover.*` file: the entry's
 * `cover` key (e.g. `'02'`) points at it, defaulting to `01`.
 */
const FILES = import.meta.glob<ImageMetadata>('/src/assets/projects/*/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
});

export interface ProjectShot {
  /** File name without extension: `cover`, `01`, `02` … (also the caption key). */
  readonly key: string;
  readonly image: ImageMetadata;
}

export interface ProjectMedia {
  /** Card image. */
  readonly cover?: ProjectShot;
  /** Whether the cover is its own file (not one of the gallery shots). */
  readonly ownCover: boolean;
  /** Gallery shots in file-name order. */
  readonly gallery: readonly ProjectShot[];
}

const BY_SLUG = new Map<string, { cover?: ImageMetadata; gallery: ProjectShot[] }>();
for (const [path, image] of Object.entries(FILES)) {
  const match = path.match(/\/src\/assets\/projects\/([^/]+)\/([^/]+)\.[a-z]+$/i);
  if (!match) continue;
  const [, slug, name] = match;
  const entry = BY_SLUG.get(slug) ?? { gallery: [] };
  if (name.toLowerCase() === 'cover') entry.cover = image;
  else entry.gallery.push({ key: name, image });
  BY_SLUG.set(slug, entry);
}
for (const entry of BY_SLUG.values()) {
  entry.gallery.sort((a, b) => a.key.localeCompare(b.key, 'en', { numeric: true }));
}

export function projectMedia(slug: string, coverKey?: string): ProjectMedia {
  const entry = BY_SLUG.get(slug);
  const gallery = entry?.gallery ?? [];
  if (entry?.cover) return { cover: { key: 'cover', image: entry.cover }, ownCover: true, gallery };
  return { cover: gallery.find((shot) => shot.key === coverKey) ?? gallery[0], ownCover: false, gallery };
}

/**
 * Shots of the detail view: the card image leads, then the rest of the gallery. A cover file
 * on its own (no gallery) only stands in for the hero of web projects.
 */
export function detailShots(media: ProjectMedia, kind: ProjectKind): ProjectShot[] {
  const { cover, gallery } = media;
  if (!cover) return [...gallery];
  if (!gallery.length) return kind === 'web' ? [cover] : [];
  return [cover, ...gallery.filter((shot) => shot !== cover)];
}

/**
 * Minimum slots per template: missing images become placeholders (web: hero + three). Backend
 * details never pad: their stack showcase fills the media block.
 */
export const PLACEHOLDER_SLOTS: Readonly<Record<ProjectKind, number>> = {
  web: 4,
  mobile: 4,
  backend: 0,
};
