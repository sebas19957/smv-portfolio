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

describe('about bio', () => {
  it('uses the CV professional profile, split into two paragraphs', () => {
    expect(getContent('es').copy.about.bio).toEqual([
      'Ingeniero de Sistemas con experiencia en liderazgo técnico y desarrollo Full Stack de aplicaciones web y móviles. Cuento con sólidos fundamentos de programación, diseño de software y arquitectura, trabajando con tecnologías como React, Angular, Next.js, Node.js y NestJS.',
      'Tengo experiencia en integración de APIs REST y GraphQL, bases de datos y servicios cloud (AWS, GCP y Azure). Integro herramientas de inteligencia artificial y flujos de desarrollo asistidos por IA en mi trabajo, combinando conocimientos de ingeniería de software con nuevas metodologías para agilizar el desarrollo y construir soluciones escalables, eficientes y mantenibles.',
    ]);
  });

  it('keeps the same two-paragraph split in every locale', () => {
    for (const locale of LOCALES) {
      const { bio } = getContent(locale).copy.about;
      expect(bio, `${locale}.about.bio`).toHaveLength(2);
      for (const paragraph of bio) expect(paragraph.length, `${locale}.about.bio`).toBeGreaterThan(80);
    }
  });
});

describe('work experience copy', () => {
  const entry = (locale: (typeof LOCALES)[number], id: string) => {
    const found = getContent(locale).copy.resume.experience.find((item) => item.id === id);
    if (!found) throw new Error(`${locale}: missing experience ${id}`);
    return found;
  };

  it('pairs every entry across locales with the same number of bullets', () => {
    const [first, ...rest] = LOCALES.map((locale) => getContent(locale).copy.resume.experience);
    for (const list of rest) {
      expect(list.map((item) => item.id)).toEqual(first.map((item) => item.id));
      list.forEach((item, i) => {
        expect(item.responsibilities, `${item.id} responsibilities`).toHaveLength(first[i].responsibilities.length);
        expect(item.achievements, `${item.id} achievements`).toHaveLength(first[i].achievements.length);
      });
    }
  });

  it('uses the CV job titles for every experience entry', () => {
    for (const locale of LOCALES) {
      expect(entry(locale, 'home-power').position).toBe('Technical Lead & Senior Full-Stack Developer');
      expect(entry(locale, 'mercadeo-virtual').position).toBe('Senior Full-Stack Developer');
      expect(entry(locale, 'atlas-global').position).toBe('Junior Frontend Developer');
    }
  });

  it('lists the Home Power duties and achievements from the CV', () => {
    const homePower = entry('es', 'home-power');
    expect(homePower.responsibilities).toEqual([
      'Liderazgo y acompañamiento del equipo de desarrollo, coordinando actividades técnicas, asignación de tareas y seguimiento al cumplimiento de objetivos.',
      'Definición de lineamientos técnicos, selección de tecnologías y toma de decisiones de arquitectura para garantizar la calidad, escalabilidad y mantenibilidad de las soluciones desarrolladas.',
      'Desarrollo y mantenimiento de aplicaciones web y móviles multiplataforma.',
      'Desarrollo de funcionalidades para aplicaciones móviles utilizando React Native CLI, Expo y Flutter.',
      'Integración y consumo de APIs REST para comunicación entre aplicaciones y servicios backend.',
      'Implementación de pruebas unitarias y validación de componentes utilizando Jest.',
      'Participación en la configuración de aplicaciones, control de versiones y procesos de desarrollo utilizando GitHub.',
      'Gestión de la coordinación entre equipos multidisciplinarios para asegurar la alineación técnica y funcional durante el ciclo completo de desarrollo.',
    ]);
    expect(homePower.achievements).toEqual([
      'Optimización de la arquitectura frontend y del flujo de estado, reduciendo errores en producción y mejorando la estabilidad de las aplicaciones móviles y web.',
      'Gestión de la integración continua de pruebas automatizadas en pipelines DevOps, incrementando la cobertura y reduciendo defectos en producción.',
      'Colaboración con equipos de diseño y producto para definir arquitecturas escalables que soportaron un crecimiento sostenido del número de usuarios.',
    ]);
  });

  it('drops the Mercadeo Virtual testing duty that is not in the CV', () => {
    const { responsibilities } = entry('es', 'mercadeo-virtual');
    expect(responsibilities).toHaveLength(9);
    expect(responsibilities).not.toContain('Implementación de pruebas unitarias y de integración para mejorar la calidad del código.');
  });

  it('describes the Atlas Global forms duty as in the CV', () => {
    expect(entry('es', 'atlas-global').responsibilities).toContain('Implementación de formularios y templates.');
    expect(entry('en', 'atlas-global').responsibilities).toContain('Implementation of forms and templates.');
  });
});

describe('education copy', () => {
  const EXPECTED = {
    es: [
      { title: 'Ingeniería de Sistemas', period: '2017 - 2025', category: 'systems' },
      { title: 'NestJS + Microservicios: Aplicaciones escalables y modulares', period: '2021', category: 'diploma' },
      { title: 'Diplomado React.js y Next.js', period: '2020', category: 'diploma' },
    ],
    en: [
      { title: 'Systems Engineering', period: '2017 - 2025', category: 'systems' },
      { title: 'NestJS + Microservices: Scalable and Modular Applications', period: '2021', category: 'diploma' },
      { title: 'Diploma in React.js and Next.js', period: '2020', category: 'diploma' },
    ],
  } as const;

  it('lists the degree and both Udemy diplomas, newest first, without the health program', () => {
    for (const locale of LOCALES) {
      const education = getContent(locale).copy.resume.education;
      expect(education.map(({ title, period, category }) => ({ title, period, category }))).toEqual(EXPECTED[locale]);
      for (const diploma of education.filter((item) => item.category === 'diploma')) {
        expect(diploma.institution).toBe('Udemy');
      }
    }
  });
});

describe('hero lines', () => {
  it('keeps the years of experience as a fixed line', () => {
    expect(getContent('es').copy.hero.fixedPhrase).toBe('+6 años construyendo software');
    expect(getContent('en').copy.hero.fixedPhrase).toBe('6+ years building software');
  });

  it('rotates only the agreed phrases, in order', () => {
    expect(getContent('es').copy.hero.typedPhrases).toEqual([
      'Technical Lead & Full-Stack Developer',
      'Frontend, Backend y Mobile',
      'AWS · GCP · Azure · Docker',
      'Desarrollo asistido por IA',
    ]);
    expect(getContent('en').copy.hero.typedPhrases).toEqual([
      'Technical Lead & Full-Stack Developer',
      'Frontend, Backend & Mobile',
      'AWS · GCP · Azure · Docker',
      'AI-assisted development',
    ]);
  });

  it('never repeats the fixed line in the rotation', () => {
    for (const locale of LOCALES) {
      const { fixedPhrase, typedPhrases } = getContent(locale).copy.hero;
      expect(typedPhrases, locale).not.toContain(fixedPhrase);
    }
  });

  it('keeps every line short enough for at most two lines on a 360px screen', () => {
    for (const locale of LOCALES) {
      const { fixedPhrase, typedPhrases } = getContent(locale).copy.hero;
      for (const phrase of [fixedPhrase, ...typedPhrases]) {
        expect(phrase.trim(), `${locale}: "${phrase}"`).toBe(phrase);
        expect(phrase.length, `${locale}: "${phrase}"`).toBeLessThanOrEqual(40);
      }
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
