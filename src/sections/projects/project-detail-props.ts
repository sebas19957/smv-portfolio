import { PRODUCTS, PROJECTS, pad2, type PortfolioContent, type ProjectEntry } from '../../i18n';
import { projectMedia } from './project-media';

/**
 * Props of `ProjectDetail` for one project in one locale. Shared by the prerendered sheet
 * fragments, so a sheet is numbered and labelled exactly like the card that opens it.
 */
export function projectDetailProps(entry: ProjectEntry, { copy, locale }: PortfolioContent) {
  const { projects, ui } = copy;
  const entries: readonly ProjectEntry[] = PROJECTS;
  const related = entries.filter((other) => other.product === entry.product && other.slug !== entry.slug).map(
    (other) => ({
      slug: other.slug,
      title: `${other.copy[locale].title.base}${other.copy[locale].title.accent}`,
      part: projects.detail.parts[other.part],
    }),
  );
  return {
    index: pad2(entries.indexOf(entry) + 1),
    locale,
    entry,
    text: entry.copy[locale],
    media: projectMedia(entry.slug, entry.cover),
    related,
    ecosystem: PRODUCTS[entry.product]?.copy[locale],
    labels: {
      ...projects.detail,
      category: projects.categoryLabels[entry.category],
      demo: projects.demoLabel,
      site: projects.siteLabel,
      code: projects.codeLabel,
      newTab: ui.opensInNewTab,
    },
  };
}
