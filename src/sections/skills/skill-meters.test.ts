// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { initSkillMeters } from './skill-meters';

function renderGrid(levels: number[]): HTMLElement {
  document.body.innerHTML = `<ol data-reveal-group>${levels
    .map(
      (level) =>
        `<li data-reveal><div data-skill-meter="${level}"><span data-skill-readout>${String(level).padStart(3, '0')}</span></div></li>`,
    )
    .join('')}</ol>`;
  return document.querySelector<HTMLElement>('[data-reveal-group]')!;
}

describe('initSkillMeters', () => {
  let dispose = () => {};

  afterEach(() => {
    dispose();
    document.body.innerHTML = '';
  });

  it('starts every readout at zero', () => {
    renderGrid([95, 40]);
    dispose = initSkillMeters();

    expect([...document.querySelectorAll('[data-skill-readout]')].map((el) => el.textContent)).toEqual(['000', '000']);
  });

  it('writes every start state in one batch, never measuring in between (one layout instead of one per meter)', () => {
    renderGrid([95, 40, 70]);
    const log: string[] = [];
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      log.push('read');
      return new DOMRect(0, 0, 300, 40);
    });
    for (const readout of document.querySelectorAll<HTMLElement>('[data-skill-readout]')) {
      const descriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')!;
      Object.defineProperty(readout, 'textContent', {
        configurable: true,
        get: () => descriptor.get!.call(readout),
        set: (value: string) => {
          log.push('write');
          descriptor.set!.call(readout, value);
        },
      });
    }

    dispose = initSkillMeters();

    const firstWrite = log.indexOf('write');
    const lastWrite = log.lastIndexOf('write');
    expect(log.filter((entry) => entry === 'write')).toHaveLength(3);
    expect(log.slice(firstWrite, lastWrite + 1)).not.toContain('read');
  });
});
