import { initCollectionFilters } from '../features/collection-filter/collection-filter';
import { initContactForm } from '../features/contact-form/contact-form';
import { initIntro } from '../features/intro/intro';
import { initProjectSheet } from '../features/project-sheet/project-sheet';
import { initSiteNav } from '../features/navigation/site-nav';
import { initReveals } from '../features/reveal/reveal';
import { initScrollRail } from '../features/scroll-rail/scroll-rail';
import { initSmoothScroll } from '../features/smooth-scroll/smooth-scroll';
import { initThemeToggles } from '../features/theme/theme';
import { initSkillMeters } from '../sections/skills/skill-meters';
import { combine, type Dispose } from '../shared/lib/dispose';
import { initSplitButtons } from '../shared/ui/split-button';

/**
 * Client entry. Order matters: Lenis registers on the GSAP ticker first (so every per-frame
 * reader sees the fresh smoothed scroll), the intro clock hides the nav before the reveal
 * controller releases the no-flash guard, and the rail mounts last. View transitions are not
 * used, so the returned disposer only matters for hot reloads.
 */
export function bootClient(): Dispose {
  const smooth = initSmoothScroll();
  const intro = initIntro();
  return combine([
    smooth.dispose,
    intro.dispose,
    initThemeToggles(),
    initSiteNav(),
    initSplitButtons(),
    initContactForm(),
    initReveals(),
    initSkillMeters(),
    initCollectionFilters(),
    initScrollRail({ lenis: smooth.lenis, intro }),
    initProjectSheet(smooth.lenis),
  ]);
}
