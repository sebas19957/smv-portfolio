import { describe, expect, it } from 'vitest';
import { SECTION_ORDER, getContent, sectionIndex } from './index';
import { LOCALES } from './locales';

describe('section order', () => {
  it('closes the page with the philosophy section right before contact', () => {
    expect(SECTION_ORDER.slice(-3)).toEqual(['testimonials', 'philosophy', 'contact']);
  });

  it('numbers the philosophy section and shifts contact after it', () => {
    expect(sectionIndex('philosophy')).toBe('07');
    expect(sectionIndex('contact')).toBe('08');
  });

  it('labels every section in the nav of every locale', () => {
    for (const locale of LOCALES) {
      const { nav } = getContent(locale).copy.ui;
      for (const id of SECTION_ORDER) expect(nav[id], `${locale}.ui.nav.${id}`).toBeTruthy();
    }
  });
});

describe('philosophy copy', () => {
  it('uses the agreed nav labels', () => {
    expect(getContent('es').copy.ui.nav.philosophy).toBe('Filosofía');
    expect(getContent('en').copy.ui.nav.philosophy).toBe('Philosophy');
  });

  it('lists the same eight cards in the same order in every locale', () => {
    const ids = LOCALES.map((locale) => getContent(locale).copy.philosophy.cards.map((card) => card.id));
    expect(ids[0]).toHaveLength(8);
    for (const list of ids) expect(list).toEqual(ids[0]);
    expect(new Set(ids[0]).size).toBe(8);
  });

  it('fills every heading, card, intro and closing statement', () => {
    for (const locale of LOCALES) {
      const { philosophy } = getContent(locale).copy;
      expect(philosophy.heading.length).toBeGreaterThan(0);
      expect(philosophy.intro).toBeTruthy();
      expect(philosophy.closing).toBeTruthy();
      for (const card of philosophy.cards) {
        expect(card.title, `${locale}.${card.id}.title`).toBeTruthy();
        expect(card.text, `${locale}.${card.id}.text`).toBeTruthy();
      }
    }
  });
});

describe('footer colophon copy', () => {
  const credit = {
    es: 'El estilo visual está inspirado en Artcraft. Me encantó su diseño y adapté gran parte de él para este portafolio; todo el reconocimiento es para su equipo.',
    en: 'The visual style is inspired by Artcraft. I loved their design and adapted much of it for this portfolio; full credit goes to their team.',
  };

  it('uses the agreed labels', () => {
    expect(getContent('es').copy.footer.colophon.label).toBe('Sobre este sitio');
    expect(getContent('en').copy.footer.colophon.label).toBe('About this site');
    expect(getContent('es').copy.footer.colophon.builtWith).toBe('Hecho con');
    expect(getContent('en').copy.footer.colophon.builtWith).toBe('Built with');
  });

  it('renders the agreed credit with a single Artcraft link slot', () => {
    for (const locale of LOCALES) {
      const { credit: template, creditLink } = getContent(locale).copy.footer.colophon;
      expect(creditLink).toBe('Artcraft');
      expect(template.split('{link}'), `${locale} link slots`).toHaveLength(2);
      expect(template.replace('{link}', creditLink)).toBe(credit[locale]);
    }
  });
});

describe('skills personal note copy', () => {
  it('uses the agreed label and text', () => {
    const es = getContent('es').copy.skills.note;
    const en = getContent('en').copy.skills.note;
    expect(es.label).toBe('Una nota personal');
    expect(en.label).toBe('A personal note');
    expect(es.text).toBe(
      'Creo que, con la llegada de la inteligencia artificial, el lenguaje de programación dejó de ser una barrera. Algunas de las tecnologías que aparecen aquí las aprendí antes de la IA y otras con su apoyo, pero todas sé usarlas sin ella. Para mí, la IA llegó a ayudarnos a cubrir nuestras falencias y a optimizar el tiempo, no a hacer el trabajo por nosotros.',
    );
    expect(en.text).toBe(
      'I believe that, with the arrival of AI, programming languages stopped being a barrier. I learned some of the technologies listed here before AI and others with its help, but I can work with all of them without it. To me, AI came to help us close our gaps and make better use of our time, not to do the work for us.',
    );
  });
});
