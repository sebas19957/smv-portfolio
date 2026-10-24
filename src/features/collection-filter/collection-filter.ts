import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Dispose } from '../../shared/lib/dispose';
import { prefersReducedMotion } from '../../shared/lib/motion';
import { GROUP_STAGGER, REVEAL_FROM, REVEAL_TO } from '../reveal/reveal';

gsap.registerPlugin(ScrollTrigger);

const ALL = 'all';

/**
 * Segmented filters (`[data-filter="<scope>"]` buttons with `data-filter-value`) that show or
 * hide the matching `[data-filter-scope="<scope>"] [data-filter-tags]` items. Newly shown items
 * replay the standard blur-rise reveal with the left → right stagger.
 */
export function initCollectionFilters(): Dispose {
  const controller = new AbortController();

  document.querySelectorAll<HTMLElement>('[data-filter]').forEach((group) => {
    const scope = group.dataset.filter;
    const target = document.querySelector<HTMLElement>(`[data-filter-scope="${scope}"]`);
    if (!scope || !target) return;
    const buttons = [...group.querySelectorAll<HTMLButtonElement>('[data-filter-value]')];
    const items = [...target.querySelectorAll<HTMLElement>('[data-filter-tags]')];

    const select = (value: string) => {
      buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filterValue === value)));
      const shown: HTMLElement[] = [];
      for (const item of items) {
        const match = value === ALL || (item.dataset.filterTags ?? '').split(' ').includes(value);
        if (match && item.hidden) shown.push(item);
        item.hidden = !match;
      }
      target.dataset.filterActive = value;
      ScrollTrigger.refresh();

      if (!shown.length || prefersReducedMotion()) return;
      const box = target.getBoundingClientRect();
      shown.forEach((item) => {
        const delay = box.width > 0 ? ((item.getBoundingClientRect().left - box.left) / box.width) * GROUP_STAGGER : 0;
        gsap.fromTo(item, REVEAL_FROM, { ...REVEAL_TO, delay });
      });
    };

    buttons.forEach((button) =>
      button.addEventListener('click', () => select(button.dataset.filterValue ?? ALL), {
        signal: controller.signal,
      }),
    );
  });

  return () => controller.abort();
}
