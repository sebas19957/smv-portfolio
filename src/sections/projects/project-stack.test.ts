import { describe, expect, it } from 'vitest';
import { PROJECTS, type ProjectEntry } from '../../i18n';
import { CARD_LOGO_LIMIT, stackGroups, stackLogos } from './project-stack';

const withStack = (stack: ProjectEntry['stack']): Pick<ProjectEntry, 'stack'> => ({ stack });

describe('stackLogos', () => {
  it('lists the logo ids of every group in stack order, whatever the key order', () => {
    const entry = withStack({
      testing: ['pytest'],
      databases: [{ tech: 'postgresql', label: 'PostgreSQL 18' }],
      languages: [{ tech: 'python', label: 'Python 3.14' }],
      frameworks: ['fastapi'],
    });

    expect(stackLogos(entry)).toEqual(['python', 'fastapi', 'postgresql', 'pytest']);
  });

  it('skips plain-label items without a logo', () => {
    const entry = withStack({ languages: [{ label: 'SQL' }, 'python'], libraries: [{ label: 'Alembic' }] });

    expect(stackLogos(entry)).toEqual(['python']);
  });

  it('keeps the first occurrence of a repeated technology', () => {
    const entry = withStack({
      frameworks: ['nodejs'],
      infrastructure: [{ tech: 'docker', label: 'Docker Compose' }, { tech: 'nodejs', label: 'Node.js 24' }, 'docker'],
    });

    expect(stackLogos(entry)).toEqual(['nodejs', 'docker']);
  });

  it(`caps the list at ${CARD_LOGO_LIMIT} by default and accepts a custom limit`, () => {
    const entry = withStack({
      languages: ['typescript', 'javascript'],
      frameworks: ['nestjs', 'nodejs', 'express'],
      databases: ['postgresql', 'redis', 'mongodb'],
      infrastructure: ['docker', 'githubActions'],
    });

    expect(stackLogos(entry)).toHaveLength(CARD_LOGO_LIMIT);
    expect(stackLogos(entry).at(-1)).toBe('mongodb');
    expect(stackLogos(entry, 3)).toEqual(['typescript', 'javascript', 'nestjs']);
  });

  it('returns an empty list when nothing has a logo', () => {
    expect(stackLogos(withStack({ libraries: [{ label: 'httpx' }] }))).toEqual([]);
  });

  it('gives every backend project at least two logos for its card', () => {
    const backends = PROJECTS.filter((entry) => entry.kind === 'backend');

    expect(backends.length).toBeGreaterThan(0);
    for (const entry of backends) expect(stackLogos(entry).length, entry.slug).toBeGreaterThanOrEqual(2);
  });
});

describe('stackGroups', () => {
  it('resolves the non-empty groups to chips in stack order', () => {
    const entry = withStack({
      testing: ['vitest'],
      libraries: [],
      languages: [{ tech: 'typescript', label: 'TypeScript 6' }, { label: 'SQL' }],
    });

    expect(stackGroups(entry)).toEqual([
      {
        group: 'languages',
        items: [{ label: 'TypeScript 6', tech: 'typescript' }, { label: 'SQL' }],
      },
      { group: 'testing', items: [{ label: 'Vitest', tech: 'vitest' }] },
    ]);
  });
});
