import { describe, expect, it } from 'vitest';
import { PRODUCTS, PROJECTS, getContent } from '../../i18n';
import { projectDetailProps } from './project-detail-props';

const entry = (slug: string) => PROJECTS.find((project) => project.slug === slug)!;

describe('projectDetailProps', () => {
  it('numbers a project by its position in the projects list, like its card', () => {
    expect(projectDetailProps(entry('worktracesearch'), getContent('en')).index).toBe('01');
    expect(projectDetailProps(entry('daylo'), getContent('en')).index).toBe(
      String(PROJECTS.indexOf(entry('daylo')) + 1).padStart(2, '0'),
    );
  });

  it('links the other parts of the same product, never the project itself', () => {
    const { related } = projectDetailProps(entry('worktracesearch-api'), getContent('en'));

    expect(related.map((item) => item.slug)).toEqual(['worktracesearch', 'worktracesearch-workers']);
    expect(related[0].part).toBe('Frontend');
  });

  it('carries the shared product overview in the requested locale', () => {
    expect(projectDetailProps(entry('worktracesearch'), getContent('es')).ecosystem).toBe(
      PRODUCTS.worktracesearch?.copy.es,
    );
    expect(projectDetailProps(entry('synthkeys'), getContent('en')).ecosystem).toBeUndefined();
  });

  it('uses the localized copy and labels', () => {
    const es = projectDetailProps(entry('daylo'), getContent('es'));
    const { projects, ui } = getContent('es').copy;

    expect(es.locale).toBe('es');
    expect(es.text).toBe(entry('daylo').copy.es);
    expect(es.labels).toMatchObject({
      ...projects.detail,
      category: projects.categoryLabels[entry('daylo').category],
      demo: projects.demoLabel,
      site: projects.siteLabel,
      code: projects.codeLabel,
      newTab: ui.opensInNewTab,
    });
  });
});
