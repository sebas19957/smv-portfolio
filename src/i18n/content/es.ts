import type { LocalizedCopy } from '../types';

export const es = {
  meta: {
    title: 'Mi Portafolio - Desarrollador Web',
    description: 'Portafolio de un desarrollador web con experiencia en Next.js, React y más.',
    ogTitle: 'Mi Portafolio - Desarrollador Web',
    ogDescription: 'Explora mi portafolio y descubre mis proyectos.',
    siteName: 'Mi Portafolio',
  },
  ui: {
    nav: {
      home: 'Inicio',
      about: 'Sobre Mí',
      skills: 'Habilidades',
      resume: 'Resumen',
      projects: 'Proyectos',
      testimonials: 'Testimonios',
      philosophy: 'Filosofía',
      contact: 'Contacto',
    },
    navLabel: 'Principal',
    toggleMenu: 'Abrir menú',
    toggleTheme: 'Cambiar tema',
    languageLabel: 'Idioma',
    languageNames: { en: 'English', es: 'Español' },
    railLabel: 'Posición en la página',
    railJumpTo: 'Ir a',
    railSectionsLabel: 'Secciones',
    skipToContent: 'Saltar al contenido',
    opensInNewTab: '(se abre en una pestaña nueva)',
  },
  hero: {
    greeting: 'Hola, soy',
    tagline:
      'Desarrollador de software con +6 años de experiencia creando soluciones web escalables y centradas en el usuario.',
    roles: ['Ingeniero de Sistemas', 'Full-stack Developer'],
    statusLabel: 'Estado',
    statusValue: 'Disponible',
    experienceLabel: 'Años Exp.',
    ctaPrimary: '¡Hablemos!',
    ctaSecondary: 'Ver Resumen',
    portraitAlt: 'Retrato de Sebastián Mosquera Valencia',
  },
  about: {
    heading: ['Soy ', { accent: 'Sebastián' }],
    role: 'Ingeniero de Sistemas · Full-stack Developer',
    bio: [
      'Soy ingeniero de sistemas y llevo unos seis años haciendo software, desde aplicaciones web y móviles hasta los servicios que las mantienen funcionando por detrás. Me gusta estar en todo el recorrido de un producto: un día ajusto una pantalla para que cargue más rápido y al siguiente estoy diseñando una API o buscando por qué una consulta se volvió lenta. Ver las dos caras me ayuda a decidir mejor, porque sé qué se rompe del otro lado cuando cambio algo.',
      'Me importa mucho lo que no se ve: una arquitectura donde cada parte tiene una sola responsabilidad, pruebas que de verdad atrapan errores y contratos claros entre el frontend y el backend. Además, tengo un gusto especial por la infraestructura y la nube, por saber dónde y cómo corre lo que construyo. Contenedores, pipelines que prueban y despliegan solos, entornos que se levantan de cero, métricas y logs que avisan antes de que alguien reporte el problema. He desplegado en servidores propios y en varios proveedores cloud, y atender incidentes en producción me dejó la costumbre de dejar todo un poco más fácil de diagnosticar para la próxima.',
      'La inteligencia artificial también me entusiasma, pero como un medio para optimizar, no para delegarle todo. Me ayuda a explorar opciones, automatizar lo repetitivo y revisar más rápido, mientras las decisiones de diseño y la responsabilidad sobre el código siguen siendo mías. En algunos proyectos la integro dentro del producto, con búsqueda semántica y modelos de IA, siempre con un plan B si el modelo no está disponible. Y cuando no estoy trabajando, casi siempre sigo programando: la mayoría de lo que vas a ver en Proyectos lo hice por mi cuenta, para resolver algo que necesitaba o probar ideas que en el trabajo no tenía dónde aplicar.',
    ],
    languages: { label: 'Idiomas', value: 'Español: Nativo | Inglés: Intermedio' },
    cvButtons: { en: 'Download CV', es: 'Descargar CV' },
    cvHelper: 'PDF · EN / ES',
    portraitAlt: 'Sebastián Mosquera Valencia con camiseta negra',
  },
  skills: {
    title: 'Mis Habilidades',
    heading: ['Mis ', { accent: 'Habilidades' }],
    subtitle: 'Más de 6 años de experiencia',
    description:
      'Desarrollador Frontend con amplia experiencia en tecnologías web modernas y una sólida formación en desarrollo backend y prácticas DevOps.',
    allLabel: 'Todas las Habilidades',
    categories: {
      frontend: 'Frontend',
      backend: 'Backend',
      mobile: 'Móvil',
      devops: 'DevOps & Testing',
      cloud: 'Cloud',
      tools: 'Herramientas',
      ai: 'IA & LLM',
    },
    note: {
      label: 'Una nota personal',
      text:
        'Creo que, con la llegada de la inteligencia artificial, el lenguaje de programación dejó de ser una barrera. Algunas de las tecnologías que aparecen aquí las aprendí antes de la IA y otras con su apoyo, pero todas sé usarlas sin ella. Para mí, la IA llegó a ayudarnos a cubrir nuestras falencias y a optimizar el tiempo, no a hacer el trabajo por nosotros.',
    },
  },
  resume: {
    title: 'Mi Experiencia',
    heading: ['Mi ', { accent: 'Experiencia' }],
    subtitle:
      'He trabajado en diversos proyectos de desarrollo web, optimización de aplicaciones y despliegue en la nube, garantizando soluciones eficientes y escalables.',
    workHeading: 'Experiencia Laboral',
    educationHeading: 'Educación',
    tasksLabel: 'Tareas y deberes',
    achievementsLabel: 'Logros',
    presentLabel: 'Actualidad',
    educationCategories: { systems: 'Ingeniería', health: 'Gestión', diploma: 'Diplomado' },
    experience: [
      {
        id: 'home-power',
        position: 'Full-stack Developer',
        period: 'Mayo 2025 - Actualidad',
        responsibilities: [
          'Desarrollo y mantenimiento de aplicaciones web y móviles multiplataforma.',
          'Desarrollo de funcionalidades para aplicaciones móviles utilizando React Native CLI, Expo y Flutter.',
          'Integración y consumo de APIs REST para comunicación entre aplicaciones y servicios backend.',
          'Implementación de pruebas unitarias y validación de componentes utilizando Jest.',
          'Gestión de estado y optimización del rendimiento en aplicaciones frontend.',
          'Configuración de builds y despliegues en entornos móviles mediante Expo y React Native CLI.',
          'Participación en la configuración de aplicaciones, control de versiones y procesos de desarrollo utilizando GitHub.',
        ],
        achievements: [
          'Optimización de la arquitectura frontend y del flujo de estado, reduciendo errores en producción y mejorando la estabilidad de las aplicaciones móviles y web.',
        ],
      },
      {
        id: 'mercadeo-virtual',
        position: 'Full-stack Developer',
        period: 'Marzo 2021 - Febrero 2025',
        description:
          'Encargado del desarrollo y mantenimiento de interfaces web, optimización de bases de datos y despliegue de aplicaciones en entornos cloud y locales.',
        responsibilities: [
          'Desarrollo y mantenimiento de múltiples aplicaciones web en producción utilizando React y Next.js.',
          'Desarrollo de interfaces web escalables y componentes orientados a la reutilización y mantenimiento.',
          'Diseño e integración de APIs REST y GraphQL para comunicación entre aplicaciones y servicios.',
          'Implementación de servicios backend utilizando .NET Core 3.0, NestJS y Node.js.',
          'Gestión y optimización de bases de datos relacionales y NoSQL.',
          'Automatización de despliegues y procesos de control de versiones mediante CI/CD.',
          'Generación y envío de reportes automatizados.',
          'Despliegue de aplicaciones en IIS y plataformas cloud como AWS, GCP, Azure y Vercel.',
          'Resolución de incidentes críticos en producción y mantenimiento de aplicaciones existentes.',
          'Implementación de pruebas unitarias y de integración para mejorar la calidad del código.',
        ],
        achievements: [
          'Desarrollé nuevos sitios web y mejoré la arquitectura de proyectos existentes.',
          'Migré y optimicé servicios internos utilizando Nest.js y Node.js, mejorando la eficiencia del backend en un 30%.',
          'Automaticé el proceso de despliegue en infraestructura propia y en la nube (IIS, GCP, AWS, Azure y Vercel).',
          'Reduje el tiempo de carga de las aplicaciones en un 40% mediante optimización de assets y consultas a la base de datos.',
          'Desarrollé herramientas internas para mejorar la productividad de los equipos de trabajo.',
        ],
      },
      {
        id: 'atlas-global',
        position: 'Frontend Developer',
        period: 'Enero 2020 - Noviembre 2020',
        description:
          'Responsable del mantenimiento y personalización de WordPress, integración de formularios y soporte técnico básico en Salesforce.',
        responsibilities: [
          'Mantenimiento y personalización de sitios web desarrollados en WordPress.',
          'Configuración y gestión básica de Salesforce.',
          'Optimización de estilos y experiencia de usuario mediante HTML y CSS.',
          'Implementación de formularios y templates personalizados.',
          'Soporte técnico y resolución de incidencias de bajo impacto.',
          'Realización de pruebas básicas y ajustes funcionales.',
        ],
        achievements: [
          'Actualicé formularios y mejoré la usabilidad en WordPress.',
          'Optimicé estilos y diseño mediante ajustes en HTML y CSS.',
          'Automaticé procesos básicos dentro de Salesforce para mejorar la gestión de datos.',
          'Desarrollé templates de correo personalizados en Salesforce para campañas de marketing.',
          'Implementé pruebas unitarias en Salesforce para validar la funcionalidad de los módulos personalizados.',
        ],
      },
    ],
    education: [
      {
        title: 'Ingeniería de Sistemas',
        institution: 'Universidad de Medellín',
        period: '2017 - 2025',
        description:
          'Formación en ingeniería de sistemas, con énfasis en Ingenierría de Software, Logíca Programación.',
        category: 'systems',
      },
      {
        title: 'Gestión de Procesos Administrativos en Salud',
        institution: 'Institución Universitaria Escolme (SENA)',
        period: '2014 - 2016',
        description: 'Formación técnica en gestión de procesos administrativos en el sector salud.',
        category: 'health',
      },
      {
        title: 'Diplomado React.js y Next.js',
        institution: 'Udemy',
        period: '2020',
        description: 'Especialización en desarrollo web con React.js y Next.js.',
        category: 'diploma',
      },
    ],
  },
  projects: {
    title: 'Mis Proyectos',
    heading: ['Proyectos ', { accent: 'Destacados' }],
    intro:
      'Una colección de proyectos en los que he trabajado, tanto a nivel profesional como personal.',
    confidentiality:
      'Por razones de confidencialidad y en cumplimiento de acuerdos de privacidad establecidos con las empresas en las que trabajé, no puedo revelar detalles sobre algunos proyectos clave en los que participé, a pesar de que fueron fundamentales para mi desarrollo profesional.',
    filters: { all: 'Todos los Proyectos', work: 'Proyectos Laborales', personal: 'Proyectos Personales' },
    categoryLabels: { work: 'Proyectos Laborales', personal: 'Proyectos Personales' },
    categoryShort: { work: 'Laboral', personal: 'Personal' },
    demoLabel: 'Demo',
    siteLabel: 'Sitio web',
    codeLabel: 'Código',
    technologiesLabel: 'Tecnologías',
    detail: {
      open: 'Ver detalle',
      close: 'Cerrar',
      overview: 'Descripción técnica',
      architecture: 'Arquitectura',
      highlights: 'Aspectos técnicos destacados',
      stack: 'Stack',
      media: 'Pantallas',
      related: 'Parte relacionada',
      ecosystem: 'Ecosistema',
      team: { pair: 'Desarrollado en equipo', group: 'Desarrollado en equipo' },
      imageSoon: 'Imagen próximamente',
      openImage: 'Abrir imagen',
      previousImage: 'Imagen anterior',
      nextImage: 'Imagen siguiente',
      stackGroups: {
        languages: 'Lenguajes',
        frameworks: 'Frameworks y runtimes',
        libraries: 'Librerías',
        databases: 'Bases de datos',
        ai: 'IA y ML',
        infrastructure: 'Infraestructura y DevOps',
        testing: 'Testing y calidad',
      },
      parts: { frontend: 'Frontend', backend: 'Backend', workers: 'Workers', mobile: 'App móvil', fullstack: 'Full stack' },
      kinds: { web: 'Web', mobile: 'Móvil', backend: 'Backend' },
    },
  },
  testimonials: {
    title: 'Testimonios',
    heading: ['Lo que dicen sobre ', { accent: 'mi trabajo' }],
    items: [
      {
        id: 'paula',
        role: 'Ingeniera de Sistemas / Project Manager / Software Development Lead',
        quote:
          'Sebastián es una persona responsable y comprometida con las labores asignadas. Le gustan los retos técnicos y aportar soluciones desde el desarrollo para que el usuario tenga una mejor experiencia. Tiene pensamiento crítico y expresa sus ideas con libertad y convicción. Es muy buen compañero y aporta al crecimiento del equipo de trabajo. Es autodidacta y busca estar actualizado en los temas de su interés y aplica lo aprendido en su trabajo. Agradezco todo su aporte y acompañamiento en el tiempo que compartimos y trabajamos juntos.',
      },
      {
        id: 'diego',
        role: 'Desarrollador backend / Automatizador de procesos',
        quote:
          'Tuve la oportunidad de colaborar con Sebastián en varios proyectos, tanto académicos como laborales. Destacó por su gran conocimiento, compromiso y disposición para aprender y mejorar constantemente. Además, su actitud positiva, resiliencia y compañerismo hicieron que trabajar con él fuera una experiencia muy enriquecedora. Es un profesional invaluable.',
      },
      {
        id: 'vanessa',
        role: 'Profesional en administración financiera',
        quote:
          'Sebastián se caracteriza por ser un profesional apasionado por su carrera, siempre está en pro del aprendizaje continuo y en busca de nuevos retos que le permitan crecer profesional y personalmente. Dentro de sus aptitudes están su atención al detalle, la innovación y la colaboración en equipo, adicionalmente, se caracteriza por su lealtad, responsabilidad y compromiso pues son pilares de su personalidad.',
      },
    ],
  },
  philosophy: {
    heading: ['Mi ', { accent: 'filosofía de vida' }],
    intro:
      'Creé esta sección para que conozcan un poquito más a la persona detrás del profesional. Con el tiempo, esos dos mundos se han ido separando cada vez más, pero para mí la persona siempre va primero.',
    cards: [
      {
        id: 'football',
        title: 'La pelota',
        text: 'Soy un apasionado del fútbol. De hecho, antes de pensar en ser programador intenté ser futbolista; es como mi sueño frustrado. Todavía juego algunas noches entre semana. Soy hincha de Atlético Nacional y del FC Barcelona, y amo a Messi con todo mi corazón. Ah, y siempre quiero que pierda el Real Madrid.',
      },
      {
        id: 'friends',
        title: 'Los amigos',
        text: 'Me gusta mucho compartir con amigos. Soy de los que se ríen todo el tiempo, hasta cuando estoy nervioso o preocupado, pero sé respetar muy bien los espacios. Con mis compañeros soy de charlar un poquito pesado, sin pasar los límites ni faltar al respeto.',
      },
      {
        id: 'newPlaces',
        title: 'Lo nuevo',
        text: 'Al principio soy muy tímido, pero me integro fácil a los ambientes nuevos y hago amistades muy rápido, porque me gusta debatir de cualquier cosa: desde la situación del país hasta cómo juega la Selección.',
      },
      {
        id: 'travelMusic',
        title: 'Viajes y música',
        text: 'Amo viajar; vivo para conocer lugares y culturas diferentes. Escucho música todo el tiempo, de todo un poquito, según mi estado de ánimo. Y me encanta Harry Potter.',
      },
      {
        id: 'curiosity',
        title: 'Curiosidad',
        text: 'Me gustan la geografía, la geopolítica y la historia, pero detesto la política como tal y a los políticos. No soy muy religioso, pero creo en Dios.',
      },
      {
        id: 'beers',
        title: 'Unas cervezas',
        text: 'Me tomo unas cervezas de vez en cuando, y me gusta tomarme algunas con compañeros, no como hábito sino para salir de la rutina.',
      },
      {
        id: 'goals',
        title: 'Propósitos',
        text: 'Estoy un poquito gordito, pero tengo como propósito bajar de peso y meterme al gym.',
      },
      {
        id: 'temper',
        title: 'Mi carácter',
        text: 'Soy muy justo con todo, para dar y para recibir, en cualquier ámbito. A veces soy temperamental. No del tipo que te va a decir groserías, pero si es necesario te voy a decir las cosas, sin faltar al respeto y sin pasar la línea. También suelo ser perfeccionista y muy exigente con los demás, y sobre todo conmigo mismo. No me cae bien la gente conformista y no me gustan para nada las excusas.',
      },
    ],
    closing:
      'Y amo lo que hago. No lo digo por quedar bien: de verdad me apasiona, y para mí es un logro personal estar haciendo lo que realmente me gusta, y no solo por dinero.',
  },
  contact: {
    title: 'Contáctame',
    heading: [{ accent: 'Contáctame' }],
    subtitle: 'Conéctate conmigo con confianza',
    text: 'Por favor, rellena el formulario de esta sección para ponerte en contacto conmigo, o escríbeme por correo.',
    emailLabel: 'Correo electrónico',
    form: {
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'tu@correo.com',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Escribe tu mensaje aquí...',
      submit: 'Enviar Mensaje',
      sending: 'Enviando...',
      status: {
        success: 'Mensaje enviado. Gracias por escribir, te responderé pronto.',
        rateLimited: 'Has alcanzado el límite de mensajes. Inténtalo de nuevo en {hours} h.',
        error: 'No se pudo enviar el mensaje. Inténtalo más tarde o escríbeme por correo.',
      },
      errors: {
        name: 'El nombre debe tener al menos 3 caracteres.',
        email: 'Ingrese un correo válido.',
        message: 'El mensaje debe tener al menos 10 caracteres.',
      },
    },
  },
  footer: {
    text: 'Soy un desarrollador creativo que transforma ideas en experiencias digitales memorables.',
    linksHeading: 'Enlaces',
    followHeading: 'Sígueme',
    legal: '© {year} SebastiánMV Portafolio. Todos los derechos reservados.',
    colophon: {
      label: 'Sobre este sitio',
      builtWith: 'Hecho con',
      credit:
        'El estilo visual está inspirado en {link}. Me encantó su diseño y adapté gran parte de él para este portafolio; todo el reconocimiento es para su equipo.',
      creditLink: 'Artcraft',
    },
  },
} as const satisfies LocalizedCopy;
