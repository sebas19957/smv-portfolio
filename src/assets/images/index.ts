import type { ImageMetadata } from 'astro';
import type { ImageKey } from '../../i18n/types';

import me from './me.png';
import profileAbout from './profile-about.png';

/**
 * Owner images keyed by the content model's `ImageKey` (optimized through astro:assets).
 * Project images are not listed here: they are auto-loaded from `src/assets/projects/<slug>/`.
 */
export const images: Record<ImageKey, ImageMetadata> = {
  me,
  profileAbout,
};
