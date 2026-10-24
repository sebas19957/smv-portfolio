import type { ProductEcosystem, ProjectEntry, StackGroup } from '../types';

/** Order of the stack groups in the detail view (and of the card's default chips). */
export const STACK_ORDER: readonly StackGroup[] = [
  'languages',
  'frameworks',
  'libraries',
  'databases',
  'ai',
  'infrastructure',
  'testing',
];

/**
 * Shared overview of multi-part products, keyed by `product`. Shown in the detail view of every
 * entry of that product, after the entry's own sections.
 */
export const PRODUCTS: Readonly<Partial<Record<string, ProductEcosystem>>> = {
  worktracesearch: {
    copy: {
      en: {
        title: 'WorkTraceSearch ecosystem',
        overview:
          'A self-hosted platform that covers the whole job search (search, match, prepare, apply, track, interview and offer), built as a polyglot pnpm + uv monorepo: a Next.js web app and a Manifest V3 extension in front of a FastAPI modular monolith, Celery workers for ingestion and AI, and PostgreSQL with pgvector as the single source of truth. 101 architecture decision records document it.',
        rows: [
          {
            label: 'Services',
            text: 'web (Next.js 16) · api (FastAPI, 21 modules, 177 endpoints) · worker, search-worker and beat (Celery) · one-shot migration job · MV3 browser extension · wts-admin operator CLI. The browser only talks to the web origin; a runtime proxy forwards /api/v1 to the API, so there is no CORS surface.',
          },
          {
            label: 'Data',
            text: 'PostgreSQL 18 + pgvector 0.8 (HNSW) through async SQLAlchemy 2.1 and 60 Alembic migrations; Redis 8 as Celery broker, rate limiter and query-vector cache; CVs and exports in a volume encrypted at rest with Fernet.',
          },
          {
            label: 'Contract',
            text: 'FastAPI exports the OpenAPI document without running a server; openapi-typescript generates the types and openapi-fetch gives the web app, the extension and the E2E suite one typed client. CI fails if the contract is stale.',
          },
          {
            label: 'Infrastructure',
            text: "One Docker Compose app on a VPS managed with Dokploy, with Traefik and Let's Encrypt in front of the web service only; multi-stage non-root images, real health checks and a health-gated startup order; images built to GHCR.",
          },
          {
            label: 'CI/CD',
            text: 'GitHub Actions with five jobs: web (lint, types, Vitest, build), contract freshness, backend (ruff, mypy strict, pytest unit + integration on real PostgreSQL and Redis), Playwright E2E on the full stack, and a backup → restore drill.',
          },
          {
            label: 'Observability',
            text: 'Opt-in OpenTelemetry: one trace from the HTTP request through Celery into SQL, custom metrics, 6 Grafana dashboards and 19 unit-tested Prometheus alert rules, all as code; structured logs carry trace ids.',
          },
          {
            label: 'Backups',
            text: 'Daily age-encrypted backups of the database and the CV volume, 7/4/6 retention, an off-site copy with rclone and automated restore verification.',
          },
        ],
      },
      es: {
        title: 'Ecosistema WorkTraceSearch',
        overview:
          'Plataforma autoalojada que cubre toda la búsqueda de empleo (buscar, evaluar el encaje, preparar, postular, hacer seguimiento, entrevistas y ofertas), construida como un monorepo políglota con pnpm y uv: una app web en Next.js y una extensión Manifest V3 frente a un monolito modular en FastAPI, workers de Celery para la ingesta y la IA, y PostgreSQL con pgvector como única fuente de verdad. La documentan 101 registros de decisiones de arquitectura (ADR).',
        rows: [
          {
            label: 'Servicios',
            text: 'web (Next.js 16) · api (FastAPI, 21 módulos, 177 endpoints) · worker, search-worker y beat (Celery) · job de migraciones de una sola ejecución · extensión de navegador MV3 · CLI de operación wts-admin. El navegador solo habla con el origen web; un proxy en tiempo de ejecución reenvía /api/v1 a la API, así que no hay superficie CORS.',
          },
          {
            label: 'Datos',
            text: 'PostgreSQL 18 + pgvector 0.8 (HNSW) con SQLAlchemy 2.1 asíncrono y 60 migraciones de Alembic; Redis 8 como broker de Celery, limitador de tasa y caché de vectores de consulta; CVs y exportaciones en un volumen cifrado en reposo con Fernet.',
          },
          {
            label: 'Contrato',
            text: 'FastAPI exporta el documento OpenAPI sin levantar el servidor; openapi-typescript genera los tipos y openapi-fetch les da a la web, la extensión y la suite E2E un mismo cliente tipado. La CI falla si el contrato está desactualizado.',
          },
          {
            label: 'Infraestructura',
            text: "Una sola app de Docker Compose en un VPS gestionado con Dokploy, con Traefik y Let's Encrypt delante únicamente del servicio web; imágenes multi-stage sin root, health checks reales y un arranque ordenado según el estado de salud; imágenes publicadas en GHCR.",
          },
          {
            label: 'CI/CD',
            text: 'GitHub Actions con cinco jobs: web (lint, tipos, Vitest, build), vigencia del contrato, backend (ruff, mypy strict, pytest unitario + integración contra PostgreSQL y Redis reales), E2E con Playwright sobre el stack completo y un simulacro de backup → restauración.',
          },
          {
            label: 'Observabilidad',
            text: 'OpenTelemetry opcional: una sola traza desde la petición HTTP, pasando por Celery, hasta el SQL; métricas propias, 6 dashboards de Grafana y 19 reglas de alerta de Prometheus con tests, todo como código; logs estructurados con trace id.',
          },
          {
            label: 'Copias de seguridad',
            text: 'Copias diarias cifradas con age de la base de datos y del volumen de CVs, retención 7/4/6, copia externa con rclone y verificación automática de la restauración.',
          },
        ],
      },
    },
  },
  'pay-remember': {
    copy: {
      en: {
        title: 'Pay Remember ecosystem',
        overview:
          'Pay Remember is a personal-finance reminder product split into focused services: an Expo / React Native app for end users, a NestJS API that owns the domain, a back-office panel with its own admin API, a Python microservice that renders monthly reports and a public marketing site.',
        rows: [
          {
            label: 'Services',
            text: 'Mobile app (Expo SDK 56) · Pay Remember API (NestJS 11) · admin panel (React 19 + Vite 8) · admin API (NestJS 11, early stage) · reports microservice (FastAPI + ReportLab, stateless) · marketing site (Vite + React).',
          },
          {
            label: 'Data',
            text: 'One PostgreSQL 16 instance accessed with Prisma 7: the main API owns the public schema, while the admin API keeps an isolated admin schema with its own migrations and a read-only mirror. Queues are outbox tables drained by cron workers, with no broker.',
          },
          {
            label: 'Integrations',
            text: 'Firebase Cloud Messaging for push, Google Play Billing with real-time notifications, transactional email with React Email templates, and OpenRouter for the AI assistant.',
          },
          {
            label: 'Infrastructure',
            text: 'Multi-stage, non-root Docker images published to GHCR; the API runs on a Hetzner VPS with Dokploy, next to the reports service on an internal network.',
          },
          {
            label: 'CI/CD',
            text: 'GitHub Actions on every pull request (lint, tests, build); on main, the version is computed from Conventional Commits, images are tagged and a GitHub Release is created. The admin panel adds release-please and a 90% coverage gate.',
          },
        ],
      },
      es: {
        title: 'Ecosistema Pay Remember',
        overview:
          'Pay Remember es un producto de recordatorios de finanzas personales dividido en servicios enfocados: una app en Expo / React Native para los usuarios, una API en NestJS dueña del dominio, un panel de back office con su propia API de administración, un microservicio en Python que genera los reportes mensuales y un sitio público de marketing.',
        rows: [
          {
            label: 'Servicios',
            text: 'App móvil (Expo SDK 56) · API de Pay Remember (NestJS 11) · panel de administración (React 19 + Vite 8) · API de administración (NestJS 11, etapa temprana) · microservicio de reportes (FastAPI + ReportLab, sin estado) · sitio de marketing (Vite + React).',
          },
          {
            label: 'Datos',
            text: 'Una instancia de PostgreSQL 16 accedida con Prisma 7: la API principal es dueña del esquema public y la API de administración mantiene un esquema admin aislado, con sus propias migraciones y un espejo de solo lectura. Las colas son tablas outbox que vacían workers con cron, sin broker.',
          },
          {
            label: 'Integraciones',
            text: 'Firebase Cloud Messaging para push, Google Play Billing con notificaciones en tiempo real, correo transaccional con plantillas de React Email y OpenRouter para el asistente de IA.',
          },
          {
            label: 'Infraestructura',
            text: 'Imágenes Docker multi-stage sin root publicadas en GHCR; la API corre en un VPS de Hetzner con Dokploy, junto al servicio de reportes en una red interna.',
          },
          {
            label: 'CI/CD',
            text: 'GitHub Actions en cada pull request (lint, tests, build); en main la versión se calcula desde Conventional Commits, se etiquetan las imágenes y se crea un GitHub Release. El panel de administración suma release-please y un umbral de cobertura del 90 %.',
          },
        ],
      },
    },
  },
};

/**
 * Projects, in card order. Each entry carries its language-neutral facts and its EN/ES copy.
 * Front end and back end of one product are separate entries sharing `product`.
 * Images: drop files in `src/assets/projects/<slug>/` (cover.* + 01.*, 02.* …) — see the README.
 * Repositories are private: only public, reachable URLs go in `links`.
 */
export const PROJECTS = [
  /* ---------- WorkTraceSearch ---------- */
  {
    slug: 'worktracesearch',
    product: 'worktracesearch',
    part: 'frontend',
    kind: 'web',
    category: 'personal',
    accent: 'orange',
    captions: {
      cover: { en: 'Opportunities board, dark theme', es: 'Tablero de oportunidades, tema oscuro' },
      '01': { en: 'Dashboard', es: 'Panel principal' },
      '02': { en: 'Opportunities with match scores', es: 'Oportunidades con puntaje de encaje' },
      '03': { en: 'Job detail with the match breakdown', es: 'Detalle de la oferta con el desglose del encaje' },
      '04': { en: 'Applications Kanban board', es: 'Tablero Kanban de postulaciones' },
      '05': { en: 'CV analysis', es: 'Análisis del CV' },
      '06': { en: 'Interviews', es: 'Entrevistas' },
    },
    stack: {
      languages: [{ tech: 'typescript', label: 'TypeScript 6' }],
      frameworks: [
        { tech: 'nextjs', label: 'Next.js 16' },
        { tech: 'react', label: 'React 19' },
        'chromeExtension',
      ],
      libraries: [
        { tech: 'heroui', label: 'HeroUI 3' },
        { label: 'React Aria' },
        { tech: 'tailwind', label: 'Tailwind CSS 4' },
        { tech: 'tanstackQuery', label: 'TanStack Query 5' },
        { tech: 'zustand', label: 'Zustand 5' },
        'reactHookForm',
        { tech: 'zod', label: 'Zod 4' },
        { label: 'next-intl' },
        { tech: 'openapi', label: 'openapi-fetch' },
        { tech: 'vite', label: 'Vite 8 (extension)' },
      ],
      infrastructure: ['docker'],
      testing: ['vitest', { tech: 'testingLibrary', label: 'Testing Library' }, 'msw', 'playwright', 'eslint'],
    },
    chips: [
      { tech: 'nextjs', label: 'Next.js 16' },
      { tech: 'react', label: 'React 19' },
      'typescript',
      'tanstackQuery',
      'heroui',
      'playwright',
    ],
    copy: {
      en: {
        title: { base: 'Work\u00adTrace\u00adSearch ', accent: 'Web' },
        summary:
          'Next.js 16 / React 19 dashboard for a self-hosted job-search platform, with a typed OpenAPI client, an accessible Kanban and a CV editor.',
        overview:
          'The signed-in app of WorkTraceSearch: opportunities with explainable match scores, semantic search, an application tracker, CVs and a CV editor, interviews, offers, income, analytics and automations, in English and Spanish across 38 App Router pages. It ships with a Manifest V3 browser extension that captures the job posting open in a tab (JSON-LD first, visible text otherwise, with per-site adapters) and sends it for review with a personal API token.',
        architecture:
          'Feature-based folders, atomic design for shared UI and a strict container/presentational split; thin routes render a single container. TanStack Query is the only owner of server state, Zustand holds UI state and the URL holds search state, so views are shareable and work with back/forward. A runtime proxy forwards /api/v1 to the FastAPI service with an httpOnly session cookie (same origin, no CORS), and every call goes through the openapi-fetch client generated from the API contract.',
        highlights: [
          'End-to-end types: openapi-typescript + openapi-fetch generated from the FastAPI contract and shared by the web app, the extension and the E2E suite.',
          "Optimistic updates with rollback on 409 conflicts, backed by the API's version columns.",
          'Keyboard-accessible Kanban drag and drop built on React Aria, tested in jsdom and with Playwright pointer drags.',
          'CV editor with structured blocks and templates, pagination by measured rows (ResizeObserver), "fit to one page", autosave with revision conflict detection and AI block edits shown as an inline diff.',
          'Editorial design system with OKLCH tokens in light and dark; design-token tests compute WCAG contrast pairs and enforce theme parity.',
          'i18n with next-intl, enforced by lint (no untranslated JSX text) and by tests that fail on a missing translation.',
          'About 2.1k Vitest tests with Testing Library and MSW, 31 Playwright journeys on the real stack and visual regression in two themes and two viewports.',
          'Manifest V3 extension built with Vite: service worker, popup and options page, with optional host permissions requested at runtime.',
        ],
      },
      es: {
        title: { base: 'Work\u00adTrace\u00adSearch ', accent: 'Web' },
        summary:
          'Panel en Next.js 16 / React 19 para una plataforma de búsqueda de empleo autoalojada, con cliente OpenAPI tipado, Kanban accesible y editor de CV.',
        overview:
          'La aplicación autenticada de WorkTraceSearch: oportunidades con puntajes de encaje explicables, búsqueda semántica, seguimiento de postulaciones, CVs y editor de CV, entrevistas, ofertas, ingresos, analítica y automatizaciones, en inglés y español, a lo largo de 38 páginas del App Router. Incluye una extensión de navegador Manifest V3 que captura la oferta abierta en una pestaña (primero JSON-LD y, si no, el texto visible, con adaptadores por sitio) y la envía a revisión con un token de API personal.',
        architecture:
          'Carpetas por feature, diseño atómico para la UI compartida y una separación estricta entre contenedores y componentes de presentación; las rutas son delgadas y renderizan un solo contenedor. TanStack Query es el único dueño del estado del servidor, Zustand guarda el estado de UI y la URL el estado de búsqueda, así que las vistas se pueden compartir y funcionan con atrás/adelante. Un proxy en tiempo de ejecución reenvía /api/v1 al servicio FastAPI con una cookie de sesión httpOnly (mismo origen, sin CORS), y cada llamada pasa por el cliente openapi-fetch generado a partir del contrato de la API.',
        highlights: [
          'Tipos de extremo a extremo: openapi-typescript + openapi-fetch generados desde el contrato de FastAPI y compartidos por la web, la extensión y la suite E2E.',
          'Actualizaciones optimistas con reversión ante conflictos 409, respaldadas por las columnas de versión de la API.',
          'Kanban con arrastrar y soltar accesible por teclado sobre React Aria, probado en jsdom y con arrastres de puntero en Playwright.',
          'Editor de CV con bloques estructurados y plantillas, paginación por filas medidas (ResizeObserver), “ajustar a una página”, autoguardado con detección de conflictos por revisión y ediciones de bloques con IA mostradas como diff en línea.',
          'Sistema de diseño editorial con tokens OKLCH en claro y oscuro; tests de tokens que calculan pares de contraste WCAG y verifican la paridad entre temas.',
          'i18n con next-intl, reforzada por lint (sin texto JSX sin traducir) y por tests que fallan si falta una traducción.',
          'Unos 2.100 tests con Vitest, Testing Library y MSW, 31 recorridos de Playwright sobre el stack real y regresión visual en dos temas y dos viewports.',
          'Extensión Manifest V3 construida con Vite: service worker, popup y página de opciones, con permisos de host opcionales solicitados en tiempo de ejecución.',
        ],
      },
    },
  },
  {
    slug: 'worktracesearch-api',
    product: 'worktracesearch',
    part: 'backend',
    kind: 'backend',
    category: 'personal',
    accent: 'amber',
    captions: {
      cover: { en: 'Swagger UI: health and auth endpoints', es: 'Swagger UI: endpoints de salud y autenticación' },
      '01': { en: 'Swagger UI: jobs and matches endpoints', es: 'Swagger UI: endpoints de ofertas y coincidencias' },
    },
    stack: {
      languages: [{ tech: 'python', label: 'Python 3.14' }, { label: 'SQL' }],
      frameworks: [{ tech: 'fastapi', label: 'FastAPI 0.142' }, { label: 'Uvicorn' }],
      libraries: [
        { tech: 'pydantic', label: 'Pydantic 2' },
        { tech: 'sqlalchemy', label: 'SQLAlchemy 2.1 (async)' },
        { label: 'Alembic' },
        { label: 'psycopg 3' },
        { label: 'argon2-cffi' },
        { label: 'cryptography (Fernet)' },
        { label: 'structlog' },
        { tech: 'openapi', label: 'OpenAPI' },
      ],
      databases: [{ tech: 'postgresql', label: 'PostgreSQL 18' }, { label: 'pgvector 0.8' }, { tech: 'redis', label: 'Redis 8' }],
      infrastructure: ['docker', 'opentelemetry', 'sentry'],
      testing: [{ tech: 'pytest', label: 'pytest 9' }, { label: 'mypy (strict)' }, 'ruff'],
    },
    chips: [
      { tech: 'python', label: 'Python 3.14' },
      'fastapi',
      'sqlalchemy',
      { tech: 'postgresql', label: 'PostgreSQL 18' },
      'redis',
      'pytest',
    ],
    copy: {
      en: {
        title: { base: 'Work\u00adTrace\u00adSearch ', accent: 'API' },
        summary:
          'FastAPI modular monolith on Python 3.14: 21 hexagonal modules and 177 endpoints over PostgreSQL 18, pgvector and Redis.',
        overview:
          'The HTTP core of WorkTraceSearch: authentication and sessions, profile and skills, job sources and jobs, search profiles, explainable matches, applications with 14 states, tasks, contacts, interviews, offers, income, FX, notifications, privacy, CVs, AI and analytics. Around 98k lines of Python and 60 Alembic migrations, with an operator CLI (wts-admin) as a second driving adapter over the same use cases.',
        architecture:
          "Hexagonal modular monolith with the dependency rule api → application → domain ← infrastructure. The domain is pure Python, ports are typing.Protocol and there is one use case per file; modules talk only through another module's application builders, never through its ORM models, and app/core never imports modules. Persistence uses async SQLAlchemy 2.1 with psycopg 3 behind an explicit Unit of Work, UUIDv7 ids assigned by the domain, optimistic concurrency (version columns, 409 on conflict), PostgreSQL full-text search and pgvector HNSW for semantic search. Background work is sent to Celery by task name, without importing the workers.",
        highlights: [
          'Explainable matching domain: nine weighted rule dimensions as pure, table-tested code, an explicit neutral policy for unknown data, hard blockers that always win, and results stored with a scoring version and input fingerprints so only stale matches recalculate.',
          'Security model: Argon2id, opaque server-side sessions in an httpOnly SameSite cookie, a CSRF Origin check on unsafe methods, fail-open Redis rate limiting, a request body-size limit and Fernet encryption at rest with key rotation.',
          'Contract pipeline: the OpenAPI document is exported without running a server, and CI fails when the generated TypeScript types are stale.',
          'Low-latency semantic search: the API never loads the model; it waits briefly on a dedicated Celery queue for the query embedding, caches vectors in Redis and falls back to full-text search when the model is unavailable.',
          'Privacy by design: email verification, single-use hashed reset links, a session list with "sign out everywhere", a per-user security log, encrypted GDPR-style export and account deletion.',
          'Personal API tokens on bearer-only routes for the browser extension, signed unsubscribe links and a revocable iCalendar feed.',
          'Readiness checks PostgreSQL and Redis concurrently with 2 s timeouts and degrades instead of crashing.',
          'About 4.1k pytest tests (in-memory fakes for domain and application, integration against real PostgreSQL and Redis), mypy strict and ruff with bandit rules.',
        ],
      },
      es: {
        title: { base: 'Work\u00adTrace\u00adSearch ', accent: 'API' },
        summary:
          'Monolito modular en FastAPI sobre Python 3.14: 21 módulos hexagonales y 177 endpoints sobre PostgreSQL 18, pgvector y Redis.',
        overview:
          'El núcleo HTTP de WorkTraceSearch: autenticación y sesiones, perfil y habilidades, fuentes y ofertas de empleo, perfiles de búsqueda, coincidencias explicables, postulaciones con 14 estados, tareas, contactos, entrevistas, ofertas, ingresos, tipos de cambio, notificaciones, privacidad, CVs, IA y analítica. Unas 98 mil líneas de Python y 60 migraciones de Alembic, con una CLI de operación (wts-admin) como segundo adaptador de entrada sobre los mismos casos de uso.',
        architecture:
          'Monolito modular hexagonal con la regla de dependencias api → application → domain ← infrastructure. El dominio es Python puro, los puertos son typing.Protocol y hay un caso de uso por archivo; los módulos se comunican solo a través de los builders de la capa de aplicación de otro módulo, nunca de sus modelos ORM, y app/core nunca importa módulos. La persistencia usa SQLAlchemy 2.1 asíncrono con psycopg 3 detrás de un Unit of Work explícito, IDs UUIDv7 asignados por el dominio, concurrencia optimista (columnas de versión, 409 ante conflicto), búsqueda de texto completo de PostgreSQL y pgvector con HNSW para la búsqueda semántica. El trabajo en segundo plano se envía a Celery por nombre de tarea, sin importar los workers.',
        highlights: [
          'Dominio de coincidencias explicable: nueve dimensiones de reglas ponderadas como código puro probado con tablas, una política neutral explícita para los datos desconocidos, bloqueadores que siempre ganan y resultados guardados con versión de puntuación y huellas de entrada, para recalcular solo lo desactualizado.',
          'Modelo de seguridad: Argon2id, sesiones opacas del lado del servidor en una cookie httpOnly SameSite, verificación CSRF por Origin en métodos no seguros, rate limiting con Redis tolerante a fallos (fail-open), límite de tamaño del cuerpo y cifrado en reposo con Fernet y rotación de claves.',
          'Pipeline de contrato: el documento OpenAPI se exporta sin levantar el servidor y la CI falla si los tipos de TypeScript generados están desactualizados.',
          'Búsqueda semántica de baja latencia: la API nunca carga el modelo; espera brevemente el embedding de la consulta en una cola dedicada de Celery, guarda los vectores en Redis y recurre a la búsqueda de texto completo si el modelo no está disponible.',
          'Privacidad desde el diseño: verificación de correo, enlaces de restablecimiento de un solo uso con hash, lista de sesiones con “cerrar sesión en todas partes”, registro de seguridad por usuario, exportación cifrada al estilo RGPD y eliminación de cuenta.',
          'Tokens de API personales en rutas solo bearer para la extensión de navegador, enlaces de baja firmados y un feed iCalendar revocable.',
          'El readiness revisa PostgreSQL y Redis en paralelo con timeouts de 2 s y se degrada en lugar de caerse.',
          'Unos 4.100 tests con pytest (fakes en memoria para dominio y aplicación, integración contra PostgreSQL y Redis reales), mypy strict y ruff con reglas de bandit.',
        ],
      },
    },
  },
  {
    slug: 'worktracesearch-workers',
    product: 'worktracesearch',
    part: 'workers',
    kind: 'backend',
    category: 'personal',
    accent: 'vermilion',
    stack: {
      languages: [{ tech: 'python', label: 'Python 3.14' }],
      frameworks: [{ tech: 'celery', label: 'Celery 5.6' }],
      libraries: [{ label: 'httpx' }, { label: 'pypdf' }, { label: 'python-docx' }, { tech: 'playwright', label: 'Playwright (Chromium)' }],
      databases: [{ tech: 'postgresql', label: 'PostgreSQL 18' }, { label: 'pgvector (HNSW)' }, { tech: 'redis', label: 'Redis 8 (broker)' }],
      ai: [
        'openrouter',
        { tech: 'deepseek', label: 'DeepSeek models' },
        { label: 'fastembed' },
        'onnx',
        { tech: 'huggingface', label: 'Multilingual MiniLM' },
      ],
      infrastructure: [
        { tech: 'docker', label: 'Docker Compose' },
        'dokploy',
        'traefik',
        'letsEncrypt',
        'githubActions',
        { tech: 'github', label: 'GHCR' },
        'opentelemetry',
        'prometheus',
        'grafana',
        'jaeger',
      ],
      testing: ['pytest'],
    },
    chips: ['python', 'celery', 'redis', 'onnx', 'openrouter', 'opentelemetry'],
    copy: {
      en: {
        title: { base: 'Work\u00adTrace\u00adSearch ', accent: 'Workers' },
        summary:
          'Celery workers that ingest jobs from 15 ToS-aware connectors, embed them locally with ONNX into pgvector and run consented LLM features.',
        overview:
          'The background side of WorkTraceSearch, about 45 named Celery tasks: per-source job ingestion, normalization with provenance, deduplication and versioned re-normalization from stored snapshots; matching and local embeddings; LLM analysis of jobs and CVs, cover letters and interview preparation; CV text extraction and PDF/Word export; notifications and an email outbox; dated FX rates; and privacy jobs for data export and account erasure.',
        architecture:
          "One image runs three Celery roles over Redis: worker for ingestion, AI and documents; search-worker on a dedicated queue (concurrency 1) so a search never waits behind ingestion; and beat as the single scheduler, within each source's policy. Tasks reuse the API modules' use cases through their own composition root, run async code with asyncio.run and are idempotent with at-least-once delivery (late acks, reject on worker lost). OpenTelemetry context travels in message headers, so an API request, its Celery task and its SQL show up as one trace.",
        highlights: [
          "ToS-aware ingestion: a catalogue of 32 platforms whose access mode comes from each platform's terms; 15 connectors (public APIs, RSS, ATS boards and credential-gated official APIs), and import-only for platforms that forbid automation.",
          'Polite HTTP by design: an identifying User-Agent, per-source request budgets and pacing, exponential backoff, and per-source isolation so one failing source never fails the rest.',
          'Local embeddings: multilingual MiniLM through fastembed on ONNX Runtime (CPU), stored in pgvector with an HNSW cosine index; no job or CV text leaves the server to be embedded.',
          'Responsible LLM gateway: OpenRouter behind a port, called only on user request and after revocable consent, with strict JSON schemas, zero data retention, versioned prompts, fenced untrusted text and removal of claims the CV does not support.',
          'Per-user AI quotas reserved under PostgreSQL advisory locks and settled with tokens, cost and latency, with a daily limit, a monthly budget and an 80% warning.',
          'Sandboxed CV parsing in a child process with memory, CPU and file-size rlimits, file type detected by bytes; PDF export rendered by headless Chromium (Playwright) through a single-use render token.',
          'Connector tests against recorded fixtures from 15 sources; E2E runs with a recorded fake LLM provider and an offline embedder for deterministic results.',
        ],
      },
      es: {
        title: { base: 'Work\u00adTrace\u00adSearch ', accent: 'Workers' },
        summary:
          'Workers de Celery que ingieren ofertas desde 15 conectores que respetan los términos de cada fuente, generan embeddings locales con ONNX en pgvector y ejecutan funciones de LLM con consentimiento.',
        overview:
          'La parte en segundo plano de WorkTraceSearch, unas 45 tareas de Celery con nombre: ingesta de ofertas por fuente, normalización con procedencia, deduplicación y re-normalización versionada a partir de snapshots guardados; cálculo de coincidencias y embeddings locales; análisis con LLM de ofertas y CVs, cartas de presentación y preparación de entrevistas; extracción de texto de CVs y exportación a PDF/Word; notificaciones y un outbox de correos; tipos de cambio fechados; y tareas de privacidad para exportar datos y borrar cuentas.',
        architecture:
          'Una sola imagen ejecuta tres roles de Celery sobre Redis: worker para ingesta, IA y documentos; search-worker en una cola dedicada (concurrencia 1) para que una búsqueda nunca espere detrás de la ingesta; y beat como único planificador, dentro de la política de cada fuente. Las tareas reutilizan los casos de uso de los módulos de la API mediante su propio composition root, ejecutan código asíncrono con asyncio.run y son idempotentes, con entrega al menos una vez (acks tardíos, rechazo si se pierde el worker). El contexto de OpenTelemetry viaja en los headers del mensaje, así que una petición a la API, su tarea de Celery y su SQL aparecen como una sola traza.',
        highlights: [
          'Ingesta que respeta los términos de servicio: un catálogo de 32 plataformas cuyo modo de acceso se deriva de los términos de cada una; 15 conectores (APIs públicas, RSS, tableros ATS y APIs oficiales con credenciales) y solo importación manual en las plataformas que prohíben la automatización.',
          'HTTP respetuoso por diseño: User-Agent identificable, presupuestos y ritmo de peticiones por fuente, backoff exponencial y aislamiento por fuente, para que una fuente caída nunca afecte a las demás.',
          'Embeddings locales: MiniLM multilingüe con fastembed sobre ONNX Runtime (CPU), guardados en pgvector con un índice HNSW por coseno; ningún texto de ofertas o CVs sale del servidor para generar embeddings.',
          'Gateway de LLM responsable: OpenRouter detrás de un puerto, invocado solo a petición del usuario y tras un consentimiento revocable, con JSON schema estricto, cero retención de datos, prompts versionados, texto no confiable delimitado y eliminación de las afirmaciones que el CV no respalda.',
          'Cuotas de IA por usuario reservadas con advisory locks de PostgreSQL y liquidadas con tokens, costo y latencia, con límite diario, presupuesto mensual y aviso al 80 %.',
          'Lectura de CVs aislada en un proceso hijo con rlimits de memoria, CPU y tamaño de archivo, y tipo de archivo detectado por sus bytes; exportación a PDF renderizada con Chromium headless (Playwright) mediante un token de render de un solo uso.',
          'Tests de conectores contra fixtures grabados de 15 fuentes; los E2E usan un proveedor de LLM falso grabado y un embedder offline para obtener resultados deterministas.',
        ],
      },
    },
  },

  /* ---------- VaultyPass ---------- */
  {
    slug: 'vaultypass',
    product: 'vaultypass',
    part: 'frontend',
    kind: 'web',
    category: 'personal',
    accent: 'violet',
    captions: {
      cover: { en: 'Vault, dark theme', es: 'Bóveda, tema oscuro' },
      '01': { en: 'Landing page', es: 'Página de inicio' },
      '02': { en: 'Features page', es: 'Página de funcionalidades' },
      '03': { en: 'Vault, light theme', es: 'Bóveda, tema claro' },
      '04': { en: 'Password generator', es: 'Generador de contraseñas' },
      '05': { en: 'Command palette', es: 'Paleta de comandos' },
      '06': { en: 'Security settings', es: 'Ajustes de seguridad' },
    },
    stack: {
      languages: ['typescript'],
      frameworks: [
        { tech: 'nextjs', label: 'Next.js 16' },
        { tech: 'react', label: 'React 19' },
      ],
      libraries: [
        { tech: 'tailwind', label: 'Tailwind CSS 4' },
        'radix',
        { tech: 'tanstackQuery', label: 'TanStack Query 5' },
        { tech: 'tanstack', label: 'TanStack Table' },
        { tech: 'zustand', label: 'Zustand 5' },
        'reactHookForm',
        { tech: 'zod', label: 'Zod 4' },
        'framerMotion',
        { label: 'cmdk' },
        { label: 'zxcvbn-ts' },
      ],
      testing: [{ tech: 'eslint', label: 'ESLint 9' }, { label: 'Husky + commitlint' }],
    },
    chips: [
      { tech: 'nextjs', label: 'Next.js 16' },
      { tech: 'react', label: 'React 19' },
      'typescript',
      { tech: 'tailwind', label: 'Tailwind CSS 4' },
      'tanstackQuery',
      'zod',
    ],
    copy: {
      en: {
        title: { base: 'Vaulty', accent: 'Pass' },
        summary:
          'Next.js 16 password-manager client with in-memory access tokens, single-flight refresh, idle auto-lock and TOTP 2FA.',
        overview:
          'The web client of VaultyPass, a personal password manager: marketing landing, authentication and the vault itself, with projects, tags, favorites, credential CRUD, a password generator with a live strength meter, a command palette, and profile, appearance and security settings including TOTP setup and active sessions. It has no backend of its own: everything goes through the VaultyPass API.',
        architecture:
          'App Router with route groups for marketing, auth and the app; components by concern, data hooks per resource and typed endpoint modules with DTO ↔ domain mappers. Server state lives in TanStack Query and client state in Zustand stores. A fetchWithAuth wrapper sends the in-memory bearer token, refreshes through an httpOnly cookie with a single shared in-flight request and hands failures to an unauthorized handler.',
        highlights: [
          'Auth client built for a password manager: access token in memory only, refresh via an httpOnly cookie (migrated away from sessionStorage), single-flight refresh and redirects away from auth pages once signed in.',
          'Idle auto-lock that really invalidates the session, an auto-clearing clipboard and on-demand reveal: secrets never travel in list payloads.',
          'Google and GitHub OAuth in a popup so the main tab never navigates away; full TOTP flow with QR setup and backup codes; sessions and devices management.',
          'Command palette (⌘K) with cmdk, a password generator with a zxcvbn live meter, an icon picker with a colored-initial fallback and light/dark themes without flash.',
          'Forms with React Hook Form and Zod 4 schemas, tables with TanStack Table and Radix UI primitives under a monochrome design system.',
          'Honest product copy: unsubstantiated "zero-knowledge" claims removed and biometrics marked as coming soon.',
          'Strict workflow: pnpm only, staged files type-checked and linted before every commit, and Conventional Commits enforced by commitlint.',
        ],
      },
      es: {
        title: { base: 'Vaulty', accent: 'Pass' },
        summary:
          'Cliente de gestor de contraseñas en Next.js 16 con access token en memoria, refresh single-flight, bloqueo automático por inactividad y 2FA TOTP.',
        overview:
          'El cliente web de VaultyPass, un gestor de contraseñas personal: landing, autenticación y la bóveda en sí, con proyectos, etiquetas, favoritos, CRUD de credenciales, un generador de contraseñas con medidor de fortaleza en vivo, paleta de comandos y ajustes de perfil, apariencia y seguridad, incluida la activación de TOTP y las sesiones activas. No tiene backend propio: todo pasa por la API de VaultyPass.',
        architecture:
          'App Router con grupos de rutas para marketing, autenticación y la app; componentes por responsabilidad, hooks de datos por recurso y módulos de endpoints tipados con mappers DTO ↔ dominio. El estado del servidor vive en TanStack Query y el del cliente en stores de Zustand. Un wrapper fetchWithAuth envía el bearer token guardado en memoria, renueva la sesión mediante una cookie httpOnly con una única petición en curso compartida y delega los fallos a un manejador de acceso no autorizado.',
        highlights: [
          'Cliente de autenticación pensado para un gestor de contraseñas: access token solo en memoria, refresh mediante cookie httpOnly (migrado desde sessionStorage), refresh single-flight y redirección fuera de las páginas de acceso una vez iniciada la sesión.',
          'Bloqueo automático por inactividad que invalida de verdad la sesión, portapapeles que se limpia solo y revelado bajo demanda: los secretos nunca viajan en los listados.',
          'OAuth con Google y GitHub en un popup para que la pestaña principal nunca navegue; flujo TOTP completo con QR y códigos de respaldo; gestión de sesiones y dispositivos.',
          'Paleta de comandos (⌘K) con cmdk, generador de contraseñas con medidor zxcvbn en vivo, selector de íconos con inicial de color como respaldo y temas claro y oscuro sin parpadeo.',
          'Formularios con React Hook Form y esquemas de Zod 4, tablas con TanStack Table y primitivas de Radix UI bajo un sistema de diseño monocromático.',
          'Textos honestos: se retiraron afirmaciones de “zero-knowledge” sin respaldo y la biometría aparece como próximamente.',
          'Flujo de trabajo estricto: solo pnpm, chequeo de tipos y lint de los archivos en stage antes de cada commit, y Conventional Commits validados con commitlint.',
        ],
      },
    },
  },
  {
    slug: 'vaultypass-api',
    product: 'vaultypass',
    part: 'backend',
    kind: 'backend',
    category: 'personal',
    accent: 'indigo',
    captions: {
      cover: { en: 'Swagger UI: auth endpoints', es: 'Swagger UI: endpoints de autenticación' },
      '01': { en: 'Swagger UI: vault, users and settings endpoints', es: 'Swagger UI: endpoints de bóveda, usuarios y ajustes' },
    },
    stack: {
      languages: ['typescript'],
      frameworks: ['nodejs', { tech: 'nestjs', label: 'NestJS 11' }],
      libraries: [
        { tech: 'prisma', label: 'Prisma 5' },
        'passport',
        'jwt',
        { label: 'argon2' },
        { label: 'otplib (TOTP)' },
        { label: 'Joi' },
        { label: 'Helmet' },
        'nodemailer',
        'swagger',
      ],
      databases: [{ tech: 'postgresql', label: 'PostgreSQL 16' }],
      infrastructure: [{ tech: 'docker', label: 'Docker Compose (dev)' }],
      testing: [{ tech: 'jest', label: 'Jest 30' }, { label: 'supertest' }, 'postman'],
    },
    chips: [{ tech: 'nestjs', label: 'NestJS 11' }, 'typescript', 'prisma', { tech: 'postgresql', label: 'PostgreSQL 16' }, 'jwt', 'swagger'],
    copy: {
      en: {
        title: { base: 'VaultyPass ', accent: 'API' },
        summary:
          'NestJS 11 + Prisma + PostgreSQL API with AES-256-GCM field encryption, rotating refresh sessions and TOTP 2FA.',
        overview:
          'The backend of VaultyPass, designed spec-first together with the web client: registration and login with argon2, Google and GitHub OAuth, email verification, password reset and change, TOTP 2FA with backup codes, sessions, settings, projects, tags and an encrypted vault, in about 47 Swagger-documented endpoints. Its security model is written down in the repository.',
        architecture:
          'NestJS modular monolith (auth, users, settings, sessions, projects, tags, vault, mail) with shared crypto, guards, decorators and filters. A global JWT guard with a @Public() opt-out and a global throttler protect every route; DTOs are validated whitelist-only and configuration is validated with Joi, so the app refuses to boot misconfigured. Prisma 5 maps users, OAuth accounts, sessions, typed hashed tokens, backup codes, projects, tags, vault items and settings on PostgreSQL 16.',
        highlights: [
          'Layered token security: a 15-minute access JWT plus a 7-day rotating refresh bound to a database session; only SHA-256 hashes are stored, and the httpOnly SameSite=Strict cookie is scoped to the refresh route.',
          'Vault encryption with AES-256-GCM: a unique IV and auth tag per field, secrets excluded from list and detail responses, and an explicit reveal endpoint served with Cache-Control: no-store.',
          'Complete 2FA: TOTP with otplib, QR provisioning, hashed single-use backup codes and a two-step login with a temporary token.',
          'Account lifecycle: argon2 hashing, email verification, typed and expiring reset/change tokens and OAuth account linking.',
          'Hardening defaults: Helmet, CORS locked to the front end with credentials, global rate limiting with per-route overrides and a uniform error envelope.',
          'Front-end integration guide, Swagger UI and a Postman collection; unit specs plus supertest e2e on Jest 30.',
        ],
      },
      es: {
        title: { base: 'VaultyPass ', accent: 'API' },
        summary:
          'API en NestJS 11 + Prisma + PostgreSQL con cifrado AES-256-GCM por campo, sesiones con refresh rotativo y 2FA TOTP.',
        overview:
          'El backend de VaultyPass, diseñado spec-first junto con el cliente web: registro e inicio de sesión con argon2, OAuth con Google y GitHub, verificación de correo, restablecimiento y cambio de contraseña, 2FA TOTP con códigos de respaldo, sesiones, ajustes, proyectos, etiquetas y una bóveda cifrada, en unos 47 endpoints documentados con Swagger. Su modelo de seguridad está documentado en el repositorio.',
        architecture:
          'Monolito modular en NestJS (auth, users, settings, sessions, projects, tags, vault, mail) con criptografía, guards, decoradores y filtros compartidos. Un guard JWT global con exclusión mediante @Public() y un throttler global protegen todas las rutas; los DTO se validan en modo whitelist y la configuración con Joi, así que la app no arranca si está mal configurada. Prisma 5 modela usuarios, cuentas OAuth, sesiones, tokens tipados con hash, códigos de respaldo, proyectos, etiquetas, elementos de la bóveda y ajustes sobre PostgreSQL 16.',
        highlights: [
          'Seguridad de tokens por capas: access JWT de 15 minutos más un refresh rotativo de 7 días ligado a una sesión en base de datos; solo se guardan hashes SHA-256 y la cookie httpOnly SameSite=Strict se limita a la ruta de refresh.',
          'Cifrado de la bóveda con AES-256-GCM: IV y auth tag únicos por campo, secretos excluidos de los listados y del detalle, y un endpoint explícito de revelado servido con Cache-Control: no-store.',
          '2FA completo: TOTP con otplib, aprovisionamiento por QR, códigos de respaldo de un solo uso con hash y login en dos pasos con un token temporal.',
          'Ciclo de vida de la cuenta: hashing con argon2, verificación de correo, tokens de restablecimiento y cambio tipados y con expiración, y vinculación de cuentas OAuth.',
          'Endurecimiento por defecto: Helmet, CORS restringido al front end con credenciales, rate limiting global con ajustes por ruta y un formato de error uniforme.',
          'Guía de integración para el front end, Swagger UI y colección de Postman; specs unitarias y e2e con supertest sobre Jest 30.',
        ],
      },
    },
  },

  /* ---------- Pay Remember ---------- */
  {
    slug: 'pay-remember',
    product: 'pay-remember',
    part: 'mobile',
    kind: 'mobile',
    category: 'personal',
    accent: 'green',
    cover: '01',
    captions: {
      '01': { en: 'Sign-in', es: 'Inicio de sesión' },
      '02': { en: 'Sign-up, step 1 of 3', es: 'Registro, paso 1 de 3' },
      '03': { en: 'Design-system showcase: buttons', es: 'Showcase del sistema de diseño: botones' },
    },
    links: { site: 'https://payremember.com/' },
    stack: {
      languages: [{ tech: 'typescript', label: 'TypeScript 6' }],
      frameworks: [
        { tech: 'reactNative', label: 'React Native 0.85' },
        { tech: 'expo', label: 'Expo SDK 56' },
        { tech: 'expo', label: 'Expo Router' },
        { tech: 'react', label: 'React 19' },
      ],
      libraries: [
        { label: 'Tamagui' },
        { tech: 'tanstackQuery', label: 'TanStack Query 5' },
        { tech: 'zustand', label: 'Zustand 5' },
        'reactHookForm',
        { tech: 'zod', label: 'Zod 4' },
        { label: 'Reanimated 4' },
        { label: 'react-native-svg' },
        { label: 'expo-secure-store' },
      ],
      infrastructure: [
        { tech: 'firebase', label: 'Firebase Cloud Messaging' },
        'googlePlay',
        'android',
      ],
      testing: [{ tech: 'eslint', label: 'ESLint 9' }],
    },
    chips: [
      { tech: 'reactNative', label: 'React Native 0.85' },
      { tech: 'expo', label: 'Expo SDK 56' },
      'typescript',
      'tanstackQuery',
      'zustand',
      { tech: 'firebase', label: 'Firebase (FCM)' },
    ],
    copy: {
      en: {
        title: { base: 'Pay ', accent: 'Remember' },
        summary:
          'Expo SDK 56 / React Native 0.85 app for bills and subscriptions, with push deep links, hand-drawn SVG reports and a premium plan.',
        overview:
          'A personal-finance reminder app, Android first, with signed builds for Google Play: it tracks bills, invoices and subscriptions, schedules push reminders, shows a week calendar and spending reports, and offers a premium plan. Email/password and native Google Sign-In run against its own NestJS API; about 360 TypeScript files.',
        architecture:
          'File-based routing with Expo Router (typed routes) and the React Compiler enabled, Atomic Design for shared components and feature-sliced modules (auth, calendar, home, invoices, notifications, onboarding, reports, settings) with their own screens, hooks and services; route files stay thin. TanStack Query owns server state, Zustand holds auth, UI, the multi-step sign-up form and pending deep links, and tokens live in expo-secure-store.',
        highlights: [
          'Resilient API client: a 10 s timeout with AbortController, automatic 401 → refresh → retry once, a single shared in-flight refresh promise and a session-expired event that signs the user out.',
          'Push notifications end to end with expo-notifications (FCM): foreground toasts with an action, and cold/warm-start deep links into an invoice through a store with a nonce.',
          'Migrated off Supabase to an in-house auth backend in small reviewed steps: login and sign-up, Google idToken exchange, refresh revocation on logout and password change.',
          'In-house design system on Tamagui with a live component showcase route (buttons, inputs, OTP, selects, sheets, dialogs, toasts…).',
          'Reports with hand-rolled react-native-svg charts (sparkline, weekly bars, type donut), a KPI band and a premium gate.',
          'Current React Native stack: New Architecture libraries (Reanimated 4, Gesture Handler), typed routes, the React Compiler and a maintained patch for Expo Router.',
          'Forms with React Hook Form and Zod; a zero-warning lint gate on every commit.',
        ],
      },
      es: {
        title: { base: 'Pay ', accent: 'Remember' },
        summary:
          'App en Expo SDK 56 / React Native 0.85 para facturas y suscripciones, con deep links desde push, reportes en SVG hechos a mano y plan premium.',
        overview:
          'App de recordatorios de finanzas personales, primero para Android y con builds firmados para Google Play: registra facturas y suscripciones, programa recordatorios push, muestra un calendario semanal y reportes de gastos, y ofrece un plan premium. El acceso con correo y contraseña y con Google Sign-In nativo funciona contra su propia API en NestJS; unos 360 archivos de TypeScript.',
        architecture:
          'Enrutamiento por archivos con Expo Router (rutas tipadas) y el React Compiler activado, Atomic Design para los componentes compartidos y módulos por feature (auth, calendar, home, invoices, notifications, onboarding, reports, settings) con sus propias pantallas, hooks y servicios; los archivos de ruta se mantienen delgados. TanStack Query maneja el estado del servidor, Zustand guarda la autenticación, la UI, el registro en varios pasos y los deep links pendientes, y los tokens viven en expo-secure-store.',
        highlights: [
          'Cliente de API resiliente: timeout de 10 s con AbortController, 401 → refresh → reintento automático una vez, una única promesa de refresh compartida y un evento de sesión expirada que cierra la sesión.',
          'Notificaciones push de extremo a extremo con expo-notifications (FCM): toasts en primer plano con acción y deep links hacia una factura en arranque en frío o en caliente, mediante un store con nonce.',
          'Migración desde Supabase a un backend de autenticación propio en pasos pequeños y revisados: login y registro, intercambio del idToken de Google, revocación del refresh al cerrar sesión y cambio de contraseña.',
          'Sistema de diseño propio sobre Tamagui con una ruta de showcase en vivo (botones, inputs, OTP, selects, sheets, diálogos, toasts…).',
          'Reportes con gráficas hechas a mano en react-native-svg (sparkline, barras semanales, dona por tipo), una banda de KPIs y un control de acceso premium.',
          'Stack actual de React Native: librerías de la Nueva Arquitectura (Reanimated 4, Gesture Handler), rutas tipadas, React Compiler y un parche mantenido para Expo Router.',
          'Formularios con React Hook Form y Zod; lint sin advertencias como requisito en cada commit.',
        ],
      },
    },
  },
  {
    slug: 'pay-remember-api',
    product: 'pay-remember',
    part: 'backend',
    kind: 'backend',
    category: 'personal',
    accent: 'mint',
    stack: {
      languages: ['typescript'],
      frameworks: [
        { tech: 'nodejs', label: 'Node.js 22' },
        { tech: 'nestjs', label: 'NestJS 11' },
      ],
      libraries: [
        { tech: 'prisma', label: 'Prisma 7' },
        { tech: 'passport', label: 'Passport JWT' },
        { label: 'bcrypt' },
        { label: 'React Email' },
        'nodemailer',
        { tech: 'firebase', label: 'Firebase Admin' },
      ],
      databases: [{ tech: 'postgresql', label: 'PostgreSQL 16' }],
      ai: ['openrouter'],
      infrastructure: [
        'docker',
        'githubActions',
        { tech: 'github', label: 'GHCR' },
        'dokploy',
        { tech: 'hetzner', label: 'Hetzner VPS' },
        { tech: 'googlePlay', label: 'Google Play Billing' },
      ],
      testing: [{ tech: 'jest', label: 'Jest 30' }, { label: 'supertest' }],
    },
    chips: [
      { tech: 'nestjs', label: 'NestJS 11' },
      { tech: 'prisma', label: 'Prisma 7' },
      { tech: 'postgresql', label: 'PostgreSQL 16' },
      'docker',
      'openrouter',
      'githubActions',
    ],
    copy: {
      en: {
        title: { base: 'Pay Remember ', accent: 'API' },
        summary:
          'NestJS 11 + Prisma 7 API with a durable email outbox, Google Play Billing, FCM push and a cost-capped AI assistant.',
        overview:
          'The backend of the Pay Remember app: its own JWT authentication with rotating refresh tokens and biometric device credentials; invoices, incomes, categories, tags and pockets; push and email notifications; Google Play subscriptions with plan limits; monthly reports rendered by a Python microservice; and an AI finance assistant. Around 226 TypeScript files with 52 spec files.',
        architecture:
          'Feature modules per domain on NestJS 11 with whitelist DTO validation, throttling, Helmet, compression and a CORS allow-list. Prisma 7 with the pg driver adapter maps about 24 models on PostgreSQL 16 across 30 migrations. There is no message broker: queues are PostgreSQL outbox tables drained by scheduled workers. Strategy seams keep integrations swappable, such as a real or a simulated billing verifier. It ships as a multi-stage, non-root Docker image that applies migrations on start, published to GHCR and deployed with Dokploy on a VPS.',
        highlights: [
          'Durable email outbox: a cron worker every minute, batches of 25, exponential backoff, at most 5 attempts and a re-entrancy guard; report jobs only enqueue, in pages, to avoid bursts that hurt sender reputation.',
          'Device credentials for biometric re-login, separate from refresh tokens: a hashed 256-bit secret rotated on every use, one per account and device, so logging out does not break fingerprint login.',
          'Google Play Billing: purchase verification through the Android Publisher API, real-time developer notifications behind a guarded webhook and plan-usage tracking.',
          'AI assistant over OpenRouter with a strict contract: no tools or attachments, bounded tokens, a financial-snapshot context builder, chart blocks parsed from the response and a monthly spending cap enforced before calling the provider.',
          'Transactional emails with React Email: 20+ templates, a shared component kit, a preview script and template tests.',
          'Release automation: semantic versions computed from Conventional Commits with git tags as the source of truth, image tags and an automatic GitHub Release.',
          'Reports offloaded to a FastAPI + ReportLab microservice through an HTTP client with a timeout.',
        ],
      },
      es: {
        title: { base: 'Pay Remember ', accent: 'API' },
        summary:
          'API en NestJS 11 + Prisma 7 con outbox de correos durable, Google Play Billing, push con FCM y un asistente de IA con tope de costo.',
        overview:
          'El backend de la app Pay Remember: autenticación JWT propia con refresh tokens rotativos y credenciales de dispositivo para el reingreso biométrico; facturas, ingresos, categorías, etiquetas y bolsillos; notificaciones push y por correo; suscripciones de Google Play con límites por plan; reportes mensuales generados por un microservicio en Python; y un asistente financiero con IA. Unos 226 archivos de TypeScript con 52 archivos de pruebas.',
        architecture:
          'Módulos por dominio en NestJS 11 con validación de DTO en modo whitelist, throttling, Helmet, compresión y una lista de orígenes CORS permitidos. Prisma 7 con el adaptador del driver pg modela unos 24 modelos sobre PostgreSQL 16 en 30 migraciones. No hay broker de mensajes: las colas son tablas outbox en PostgreSQL que vacían workers programados. Las integraciones se mantienen intercambiables mediante estrategias, como un verificador de pagos real o simulado. Se entrega como una imagen Docker multi-stage sin root que aplica las migraciones al arrancar, publicada en GHCR y desplegada con Dokploy en un VPS.',
        highlights: [
          'Outbox de correos durable: un worker cron cada minuto, lotes de 25, backoff exponencial, máximo 5 intentos y protección contra reentrada; los reportes solo encolan, por páginas, para evitar ráfagas que dañen la reputación del remitente.',
          'Credenciales de dispositivo para el reingreso biométrico, separadas de los refresh tokens: un secreto de 256 bits con hash que rota en cada uso, uno por cuenta y dispositivo, para que cerrar sesión no rompa el acceso con huella.',
          'Google Play Billing: verificación de compras con la Android Publisher API, notificaciones en tiempo real para desarrolladores detrás de un webhook protegido y seguimiento del uso por plan.',
          'Asistente de IA sobre OpenRouter con un contrato estricto: sin herramientas ni adjuntos, tokens acotados, un constructor de contexto con la foto financiera del usuario, bloques de gráficas extraídos de la respuesta y un tope de gasto mensual que se valida antes de llamar al proveedor.',
          'Correos transaccionales con React Email: más de 20 plantillas, un kit de componentes compartido, un script de previsualización y tests de plantillas.',
          'Automatización de releases: versión semántica calculada desde Conventional Commits con los tags de git como fuente de verdad, etiquetas de imagen y GitHub Release automático.',
          'Reportes delegados a un microservicio FastAPI + ReportLab mediante un cliente HTTP con timeout.',
        ],
      },
    },
  },
  {
    slug: 'pay-remember-admin',
    product: 'pay-remember',
    part: 'frontend',
    kind: 'web',
    category: 'personal',
    accent: 'teal',
    cover: '02',
    captions: {
      '01': { en: 'Sign-in', es: 'Inicio de sesión' },
      '02': { en: 'Dashboard', es: 'Panel principal' },
      '03': { en: 'Analytics', es: 'Analítica' },
      '04': { en: 'Email center', es: 'Centro de correos' },
      '05': { en: 'Roles and permissions', es: 'Roles y permisos' },
      '06': { en: 'Dashboard, dark theme', es: 'Panel principal, tema oscuro' },
    },
    stack: {
      languages: [{ tech: 'typescript', label: 'TypeScript 6' }],
      frameworks: [
        { tech: 'react', label: 'React 19' },
        { tech: 'vite', label: 'Vite 8' },
      ],
      libraries: [
        { tech: 'tanstack', label: 'TanStack Router' },
        { tech: 'tanstackQuery', label: 'TanStack Query 5' },
        { tech: 'tanstack', label: 'TanStack Table' },
        { tech: 'zustand', label: 'Zustand 5' },
        { tech: 'tailwind', label: 'Tailwind CSS 4' },
        'reactHookForm',
        { tech: 'zod', label: 'Zod 4' },
        'axios',
        'i18next',
        { label: 'Recharts' },
        { tech: 'framerMotion', label: 'Motion' },
      ],
      infrastructure: ['docker', 'nginx', 'githubActions', { tech: 'github', label: 'GHCR' }, { label: 'release-please' }],
      testing: ['vitest', { tech: 'testingLibrary', label: 'Testing Library' }, { tech: 'msw', label: 'MSW 2' }, { label: 'axe-core' }],
    },
    chips: [
      { tech: 'react', label: 'React 19' },
      { tech: 'vite', label: 'Vite 8' },
      { tech: 'tanstack', label: 'TanStack Router' },
      { tech: 'tailwind', label: 'Tailwind CSS 4' },
      'vitest',
      'msw',
    ],
    copy: {
      en: {
        title: { base: 'Pay Remember ', accent: 'Admin' },
        summary:
          'React 19 + Vite 8 back office with TanStack Router, typed RBAC, mandatory MFA and a 90% coverage gate.',
        overview:
          'The administration panel of the Pay Remember ecosystem: users, subscriptions, support, email and push campaigns with audiences, analytics, reports, audit and logs, admins and roles, settings and profile, with mandatory MFA. It was built ahead of its API thanks to a switchable mock layer and migrated to the live API module by module. 372 TypeScript files and 114 test files.',
        architecture:
          'Feature-sliced SPA on Vite 8 and React 19 with TanStack Router file routes (automatic code splitting, URL-synced list search params), TanStack Query for server state, TanStack Table for data grids and Zustand for the session. Authorization is checked per route against a typed permission catalog mirrored from the API, redirecting to a 403 page that names the missing permission. It ships as a multi-stage image served by nginx as a non-root user, with a health check.',
        highlights: [
          'Three-mode API layer (mock / hybrid / live): one mock implementation serves the dev app in-process and MSW in tests, moving a module to the real API means moving one handler entry, and production builds refuse to boot outside live mode.',
          'An honest 90% coverage gate: coverage is measured over the whole source tree, so unimported files count as 0%.',
          'Permission-typed RBAC end to end: typed permission keys, route guards with unit tests and session rebuilds that drop unknown keys.',
          'Full MFA UI: a TOTP challenge after login, and enrolment with a QR code and recovery codes.',
          'Accessible, i18n-ready design system (i18next, Spanish and English) with axe-core assertions, light/dark theme tokens and Recharts wrappers.',
          'Delivery hygiene: CI with Prettier, ESLint, tsc and Vitest coverage, a pre-publish check for required build variables, GHCR images, release-please, Dependabot and CODEOWNERS.',
        ],
      },
      es: {
        title: { base: 'Pay Remember ', accent: 'Admin' },
        summary:
          'Back office en React 19 + Vite 8 con TanStack Router, RBAC tipado, MFA obligatorio y un umbral de cobertura del 90 %.',
        overview:
          'El panel de administración del ecosistema Pay Remember: usuarios, suscripciones, soporte, campañas de correo y push con audiencias, analítica, reportes, auditoría y logs, administradores y roles, ajustes y perfil, con MFA obligatorio. Se construyó antes que su API gracias a una capa de mocks conmutable y se migró a la API real módulo por módulo. 372 archivos de TypeScript y 114 archivos de pruebas.',
        architecture:
          'SPA organizada por features sobre Vite 8 y React 19, con rutas de archivo de TanStack Router (code splitting automático y parámetros de búsqueda sincronizados con la URL), TanStack Query para el estado del servidor, TanStack Table para las tablas de datos y Zustand para la sesión. La autorización se valida por ruta contra un catálogo de permisos tipado reflejado desde la API, con redirección a una página 403 que indica el permiso faltante. Se entrega como una imagen multi-stage servida por nginx con un usuario sin root y health check.',
        highlights: [
          'Capa de API con tres modos (mock / hybrid / live): una sola implementación de mocks sirve a la app en desarrollo y a MSW en los tests, pasar un módulo a la API real es mover una entrada de handlers, y los builds de producción no arrancan fuera del modo live.',
          'Un umbral de cobertura del 90 % medido con honestidad: la cobertura incluye todo el código fuente, así que los archivos que no se importan cuentan como 0 %.',
          'RBAC tipado de extremo a extremo: claves de permiso tipadas, guards de ruta con tests unitarios y reconstrucción de la sesión que descarta claves desconocidas.',
          'UI completa de MFA: desafío TOTP después del login y enrolamiento con código QR y códigos de recuperación.',
          'Sistema de diseño accesible y listo para i18n (i18next, español e inglés) con aserciones de axe-core, tokens de tema claro y oscuro y wrappers de Recharts.',
          'Higiene de entrega: CI con Prettier, ESLint, tsc y cobertura con Vitest, una verificación previa de las variables de build requeridas, imágenes en GHCR, release-please, Dependabot y CODEOWNERS.',
        ],
      },
    },
  },
  {
    slug: 'pay-remember-admin-api',
    product: 'pay-remember',
    part: 'backend',
    kind: 'backend',
    category: 'personal',
    accent: 'cyan',
    stack: {
      languages: [{ tech: 'typescript', label: 'TypeScript 5.9' }],
      frameworks: [
        { tech: 'nodejs', label: 'Node.js 24' },
        { tech: 'nestjs', label: 'NestJS 11' },
      ],
      libraries: [
        { tech: 'prisma', label: 'Prisma 7 (multi-schema)' },
        { tech: 'passport', label: 'Passport JWT' },
        { label: 'otplib (TOTP)' },
        { label: 'bcrypt' },
        { label: 'Helmet' },
      ],
      databases: [{ tech: 'postgresql', label: 'PostgreSQL (admin schema)' }],
      infrastructure: [{ tech: 'docker', label: 'Docker Compose' }],
      testing: [{ tech: 'jest', label: 'Jest 30' }, { label: 'supertest' }],
    },
    chips: [
      { tech: 'nestjs', label: 'NestJS 11' },
      { tech: 'prisma', label: 'Prisma 7' },
      'postgresql',
      'typescript',
      'docker',
      'jest',
    ],
    copy: {
      en: {
        title: { base: 'Pay Remember ', accent: 'Admin API' },
        summary:
          'Early-stage NestJS 11 + Prisma 7 admin API: auth, RBAC and mandatory TOTP MFA in an isolated schema of a shared database.',
        overview:
          'The API behind the Pay Remember admin panel, at an early stage. So far it implements the foundation: admin login with mandatory TOTP MFA, recovery codes, sessions with an httpOnly refresh cookie, invitation and password-reset models and a seeded role and permission catalog. The remaining domains (billing, engagement, reports, audit, support, settings) are not built yet, and the panel still serves them from its mock layer.',
        architecture:
          'It shares one PostgreSQL instance with the Pay Remember API but keeps its own objects in a separate admin schema, with its own migration history and a read-only, multi-schema Prisma mirror of the public models it needs. Auth, RBAC and Prisma modules sit on a common layer with a typed exception, a global exception filter and a response interceptor; JWT and permission guards protect the routes, and the service trusts the proxy to get the real client IP.',
        highlights: [
          'Shared database, hard isolation: a separate schema and migration history, plus a drift check of the mirrored schema with prisma migrate diff.',
          "Migration guard: a script scans the generated SQL and fails if any statement touches the other service's schema or is unqualified.",
          'Mandatory TOTP MFA with secrets encrypted at rest, single-use recovery codes and per-challenge attempt limits.',
          'Fine-grained RBAC catalog seeded from code and mirrored as compile-time keys in the front end.',
          'Every dependency version and the Node engine pinned exactly; Jest 30 and supertest specs.',
        ],
      },
      es: {
        title: { base: 'Pay Remember ', accent: 'Admin API' },
        summary:
          'API de administración en etapa temprana con NestJS 11 + Prisma 7: autenticación, RBAC y MFA TOTP obligatorio en un esquema aislado de una base de datos compartida.',
        overview:
          'La API detrás del panel de administración de Pay Remember, en una etapa temprana. Por ahora implementa la base: login de administradores con MFA TOTP obligatorio, códigos de recuperación, sesiones con cookie de refresh httpOnly, modelos de invitación y restablecimiento de contraseña y un catálogo sembrado de roles y permisos. Los demás dominios (facturación, engagement, reportes, auditoría, soporte, ajustes) aún no están construidos y el panel todavía los sirve desde su capa de mocks.',
        architecture:
          'Comparte una instancia de PostgreSQL con la API de Pay Remember, pero mantiene sus propios objetos en un esquema admin separado, con su propio historial de migraciones y un espejo de solo lectura, con Prisma multi-schema, de los modelos públicos que necesita. Los módulos de auth, RBAC y Prisma se apoyan en una capa común con una excepción tipada, un filtro global de excepciones y un interceptor de respuestas; guards de JWT y de permisos protegen las rutas, y el servicio confía en el proxy para obtener la IP real del cliente.',
        highlights: [
          'Base de datos compartida con aislamiento estricto: esquema e historial de migraciones propios, más una verificación de deriva del esquema espejo con prisma migrate diff.',
          'Guardián de migraciones: un script analiza el SQL generado y falla si alguna sentencia toca el esquema del otro servicio o no está calificada.',
          'MFA TOTP obligatorio con secretos cifrados en reposo, códigos de recuperación de un solo uso y límite de intentos por desafío.',
          'Catálogo de RBAC granular sembrado desde el código y reflejado como claves en tiempo de compilación en el front end.',
          'Todas las versiones de dependencias y el motor de Node fijados de forma exacta; specs con Jest 30 y supertest.',
        ],
      },
    },
  },

  /* ---------- Daylo ---------- */
  {
    slug: 'daylo',
    product: 'daylo',
    part: 'mobile',
    kind: 'mobile',
    category: 'personal',
    accent: 'sky',
    captions: {
      cover: { en: 'Onboarding: organize your day', es: 'Onboarding: organiza tu día' },
      '01': { en: 'Onboarding: stay in control', es: 'Onboarding: mantén el control' },
      '02': { en: 'Sign-in, light theme', es: 'Inicio de sesión, tema claro' },
      '03': { en: 'Sign-in, dark theme', es: 'Inicio de sesión, tema oscuro' },
      '04': { en: 'Sign-up method', es: 'Método de registro' },
      '05': { en: 'Terms acceptance', es: 'Aceptación de términos' },
      '06': { en: 'Email verification code, dark theme', es: 'Código de verificación por correo, tema oscuro' },
    },
    stack: {
      languages: [{ tech: 'dart', label: 'Dart 3' }, 'kotlin'],
      frameworks: [{ tech: 'flutter', label: 'Flutter 3.47' }],
      libraries: [
        { label: 'Riverpod 3' },
        { label: 'go_router' },
        { label: 'drift' },
        { label: 'Dio' },
        { label: 'flutter_secure_storage' },
        { label: 'GLSL shaders' },
      ],
      databases: [{ tech: 'sqlite', label: 'SQLite (drift)' }],
      infrastructure: [{ tech: 'android', label: 'Android (exact alarms)' }],
      testing: [{ tech: 'flutter', label: 'flutter_test' }, { label: 'Contract goldens' }],
    },
    chips: [
      { tech: 'flutter', label: 'Flutter 3.47' },
      'dart',
      'kotlin',
      { tech: 'sqlite', label: 'SQLite (drift)' },
      { label: 'Riverpod 3' },
      'android',
    ],
    copy: {
      en: {
        title: { base: '', accent: 'Daylo' },
        summary:
          'Offline-first Flutter planner: drift/SQLite as the source of truth, a transactional-outbox sync engine and native Kotlin alarms.',
        overview:
          'A Spanish-language planner for tasks, routines, projects, important dates, alarms, streaks, achievements and reports, built for Android and iOS (Android is the verified, native-rich target; not yet published to the stores). Every entity lives in a local SQLite database and syncs with its own backend, so the app works fully offline and reminders keep firing from local data with the app closed.',
        architecture:
          'Feature-first Flutter app (about 20 features) with ports and adapters where there are rules: a pure-Dart domain, Riverpod controllers in the application layer, infrastructure adapters and presentation. Repositories implement the same ports as local-first drift repositories, so moving from fakes to HTTP to local-first required no screen changes, and a build flag swaps every repository for in-memory fakes. go_router drives the tab shell, guards and deep links; a Kotlin module behind a method channel owns exact alarms.',
        highlights: [
          "Offline-first sync engine in Dart: a transactional outbox shaped like the server's batch contract, pushes of up to 100 ops, pulls with a persisted cursor, full reload on 410, exponential backoff (5 s → 5 min), single-flight, Retry-After on 429 and conflict UX.",
          'Cross-repository contract tests: golden JSON scenarios (recurrence, streak ledger, reports) shared with the backend, a fixture-drift test and real-HTTP e2e, including a second device converging.',
          'Native Android alarm subsystem in Kotlin: exact alarms, a foreground ring service, rescheduling after boot or clock changes, a native recurrence engine mirrored from the Dart/server rules and notification actions that queue offline ops.',
          'Recurring tasks with "only this day / this and following / whole series" edits, series lineage and exception dates, expanded locally.',
          'Motion-first UI: depth page transitions, shared-element heroes, a spring-driven liquid tab bar and GLSL fragment shaders for streak celebrations, with light/dark parity and reduced-motion support.',
          'A test pyramid of about 330 test files: unit and widget tests, contract goldens, e2e against a local backend (airplane mode included) and Kotlin tests for the native recurrence engine.',
        ],
      },
      es: {
        title: { base: '', accent: 'Daylo' },
        summary:
          'Planificador offline-first en Flutter: drift/SQLite como fuente de verdad, un motor de sincronización con outbox transaccional y alarmas nativas en Kotlin.',
        overview:
          'Un planificador en español para tareas, rutinas, proyectos, fechas importantes, alarmas, rachas, logros y reportes, construido para Android e iOS (Android es el objetivo verificado y con más integración nativa; aún no está publicado en las tiendas). Cada entidad vive en una base de datos SQLite local y se sincroniza con su propio backend, así que la app funciona por completo sin conexión y los recordatorios siguen sonando a partir de los datos locales con la app cerrada.',
        architecture:
          'App de Flutter organizada por features (unas 20) con puertos y adaptadores donde hay reglas: dominio en Dart puro, controladores de Riverpod en la capa de aplicación, adaptadores de infraestructura y presentación. Los repositorios implementan los mismos puertos como repositorios local-first sobre drift, así que pasar de fakes a HTTP y luego a local-first no exigió cambios en las pantallas, y un flag de compilación cambia todos los repositorios por fakes en memoria. go_router gestiona las pestañas, los guards y los deep links; un módulo en Kotlin detrás de un method channel se encarga de las alarmas exactas.',
        highlights: [
          'Motor de sincronización offline-first en Dart: un outbox transaccional con la misma forma del contrato de lotes del servidor, envíos de hasta 100 operaciones, descargas con cursor persistido, recarga completa ante 410, backoff exponencial (5 s → 5 min), single-flight, Retry-After ante 429 y UX para conflictos.',
          'Tests de contrato entre repositorios: escenarios golden en JSON (recurrencia, historial de rachas, reportes) compartidos con el backend, un test que detecta divergencias en los fixtures y e2e con HTTP real, incluido un segundo dispositivo que converge.',
          'Subsistema nativo de alarmas para Android en Kotlin: alarmas exactas, un servicio en primer plano para el timbre, reprogramación tras reinicios o cambios de hora, un motor de recurrencia nativo que replica las reglas de Dart y del servidor, y acciones de notificación que encolan operaciones offline.',
          'Tareas recurrentes con ediciones de “solo este día / este y los siguientes / toda la serie”, linaje de series y fechas de excepción, expandidas localmente.',
          'UI centrada en el movimiento: transiciones de página con profundidad, héroes con elementos compartidos, una tab bar líquida con resortes y shaders de fragmentos GLSL para celebrar las rachas, con paridad entre tema claro y oscuro y soporte de movimiento reducido.',
          'Una pirámide de tests con unos 330 archivos: tests unitarios y de widgets, goldens de contrato, e2e contra un backend local (incluido el modo avión) y tests en Kotlin del motor de recurrencia nativo.',
        ],
      },
    },
  },
  {
    slug: 'daylo-api',
    product: 'daylo',
    part: 'backend',
    kind: 'backend',
    category: 'personal',
    accent: 'blue',
    stack: {
      languages: [{ tech: 'typescript', label: 'TypeScript 6' }],
      frameworks: [
        { tech: 'nodejs', label: 'Node.js 22' },
        { tech: 'fastify', label: 'Fastify 5' },
      ],
      libraries: [
        'drizzle',
        { tech: 'zod', label: 'Zod 4' },
        { label: 'pg-boss' },
        { label: 'jose (JWT / JWKS)' },
        { label: 'argon2' },
        { label: 'pino' },
        { tech: 'openapi', label: 'OpenAPI 3' },
      ],
      databases: [{ tech: 'postgresql', label: 'PostgreSQL 16' }, { tech: 'minio', label: 'S3-compatible storage' }],
      infrastructure: ['docker', 'caddy', 'githubActions', { tech: 'github', label: 'GHCR' }, 'prometheus', 'grafana'],
      testing: ['vitest', { label: 'Testcontainers' }, 'k6'],
    },
    chips: [
      { tech: 'fastify', label: 'Fastify 5' },
      'typescript',
      'drizzle',
      { tech: 'postgresql', label: 'PostgreSQL 16' },
      'docker',
      'vitest',
    ],
    copy: {
      en: {
        title: { base: 'Daylo ', accent: 'API' },
        summary:
          'Fastify 5 + Drizzle + PostgreSQL 16 sync API: a delta feed with tombstones, atomic batch pushes with savepoints and pg-boss jobs.',
        overview:
          'The backend of Daylo: accounts and sessions (JWT with key rotation, refresh-token reuse detection, Google and Apple sign-in), planner entities, a sync protocol, streak ledger and achievements, report aggregates, support, push, data export and account deletion, plus a pg-boss worker process. Built spec-first with strict TDD: 20 modules and 94 OpenAPI operations. Deployment to a single VPS is prepared but not provisioned yet.',
        architecture:
          "Hexagonal layers per module: HTTP routes with Zod schemas, application services with ports, a pure domain and infrastructure adapters, wired by plain factories in a composition root (no DI framework) with a Clock port everywhere. A Unit of Work over Drizzle transactions supports SAVEPOINT nesting, so a sync push applies each operation as a nested unit. Every query is scoped to the token's user, and cross-tenant access returns 404.",
        highlights: [
          'Sync protocol: a delta feed with tombstones and a safety lag, ID-redirect results, a batch of heterogeneous ops applied atomically with nested savepoints, 410 full-reload semantics and idempotency keys.',
          'Contract-first loop: openapi.json is generated from the Zod schemas and CI fails if it drifts; golden scenarios are shared with the Flutter repository.',
          'Security in depth: argon2id, JWT with a key-rotation script, refresh reuse detection with a grace window, a legal-acceptance gate, a redacting logger, Helmet and per-route rate limits.',
          'Tests on real infrastructure: one PostgreSQL 16 Testcontainer with template-database cloning per test file, a mutable fake clock and a local JWKS with real signed Google and Apple tokens.',
          'Ops readiness before launch: Caddy with automatic TLS, nightly pg_dump plus optional pgBackRest PITR, restore drills, Prometheus alert rules and a k6 load profile.',
          'CI with typecheck and lint, unit and integration tests, a migrations check, an OpenAPI drift check, compose validation and image builds to GHCR.',
        ],
      },
      es: {
        title: { base: 'Daylo ', accent: 'API' },
        summary:
          'API de sincronización en Fastify 5 + Drizzle + PostgreSQL 16: feed delta con tombstones, envíos por lotes atómicos con savepoints y jobs con pg-boss.',
        overview:
          'El backend de Daylo: cuentas y sesiones (JWT con rotación de claves, detección de reutilización de refresh tokens, acceso con Google y Apple), entidades del planificador, un protocolo de sincronización, historial de rachas y logros, agregados para reportes, soporte, push, exportación de datos y eliminación de cuenta, además de un proceso worker con pg-boss. Construido spec-first con TDD estricto: 20 módulos y 94 operaciones OpenAPI. El despliegue en un VPS está preparado, pero aún no aprovisionado.',
        architecture:
          'Capas hexagonales por módulo: rutas HTTP con esquemas Zod, servicios de aplicación con puertos, un dominio puro y adaptadores de infraestructura, conectados con factorías simples en un composition root (sin framework de DI) y un puerto Clock en todas partes. Un Unit of Work sobre transacciones de Drizzle admite SAVEPOINT anidados, así que un envío de sincronización aplica cada operación como una unidad anidada. Cada consulta se limita al usuario del token y el acceso a datos de otro usuario devuelve 404.',
        highlights: [
          'Protocolo de sincronización: feed delta con tombstones y margen de seguridad, resultados con redirección de IDs, un lote de operaciones heterogéneas aplicado de forma atómica con savepoints anidados, semántica de recarga completa con 410 y claves de idempotencia.',
          'Ciclo contract-first: openapi.json se genera a partir de los esquemas Zod y la CI falla si diverge; los escenarios golden se comparten con el repositorio de Flutter.',
          'Seguridad en profundidad: argon2id, JWT con script de rotación de claves, detección de reutilización de refresh con ventana de gracia, aceptación de términos como requisito, un logger que oculta datos sensibles, Helmet y límites por ruta.',
          'Tests sobre infraestructura real: un Testcontainer de PostgreSQL 16 con clonación de una base de datos plantilla por archivo de test, un reloj falso controlable y un JWKS local con tokens de Google y Apple firmados de verdad.',
          'Operación lista antes del lanzamiento: Caddy con TLS automático, pg_dump nocturno y PITR opcional con pgBackRest, simulacros de restauración, reglas de alerta de Prometheus y un perfil de carga con k6.',
          'CI con typecheck y lint, tests unitarios y de integración, verificación de migraciones, detección de deriva de OpenAPI, validación de compose y construcción de imágenes en GHCR.',
        ],
      },
    },
  },

  /* ---------- SynthKeys ---------- */
  {
    slug: 'synthkeys',
    product: 'synthkeys',
    part: 'fullstack',
    kind: 'web',
    category: 'personal',
    accent: 'magenta',
    cover: '01',
    captions: {
      '01': { en: 'Storefront home', es: 'Inicio de la tienda' },
      '02': { en: 'Catalog with filters', es: 'Catálogo con filtros' },
      '03': { en: 'Product page', es: 'Página de producto' },
      '04': { en: 'Guides', es: 'Guías' },
      '05': { en: 'Explore the catalog', es: 'Explorar el catálogo' },
    },
    team: 'pair',
    links: { live: 'https://synthkeys.shop/' },
    stack: {
      languages: [{ tech: 'typescript', label: 'TypeScript 5.7' }, { label: 'SQL (PL/pgSQL)' }],
      frameworks: [
        { tech: 'nextjs', label: 'Next.js 16' },
        { tech: 'react', label: 'React 19' },
        { tech: 'nodejs', label: 'Node.js 22' },
      ],
      libraries: [
        { tech: 'tailwind', label: 'Tailwind CSS 4' },
        'shadcn',
        { tech: 'zod', label: 'Zod 4' },
        { label: 'SWR' },
        { label: 'Recharts' },
        { label: 'Whop SDK' },
        'resend',
      ],
      databases: ['supabase', { tech: 'postgresql', label: 'PostgreSQL 17' }, { label: 'pg_cron' }],
      ai: ['openrouter'],
      infrastructure: [
        { tech: 'docker', label: 'Docker Compose' },
        'caddy',
        { tech: 'githubActions', label: 'GitHub Actions (self-hosted runner)' },
      ],
      testing: ['vitest', { tech: 'eslint', label: 'ESLint (custom rules)' }],
    },
    chips: [
      { tech: 'nextjs', label: 'Next.js 16' },
      { tech: 'react', label: 'React 19' },
      'supabase',
      { tech: 'postgresql', label: 'PostgreSQL 17' },
      { tech: 'tailwind', label: 'Tailwind CSS 4' },
      'docker',
    ],
    copy: {
      en: {
        title: { base: 'Synth', accent: 'Keys' },
        summary:
          'Full-stack Next.js 16 store on Supabase where Postgres is the authority: 99 RPCs, guarded state transitions and self-hosted CD with rollback.',
        overview:
          'A bilingual (ES/EN) digital-goods store for game keys, software licenses, memberships and gift cards: customers pay through Whop and receive their keys in an encrypted in-account vault, supplier orders are fulfilled automatically and gifts are delivered by link. One Next.js app serves the storefront, an extensive admin panel and its own API through Server Actions and Route Handlers, on top of Supabase (Postgres, Auth, Storage and pg_cron).',
        architecture:
          '"Authority lives in Postgres": business invariants such as the order-line state machine, refunds and stock are enforced inside the database through about 99 RPC functions, with 16 guarded transitions as SECURITY DEFINER functions, row-level security everywhere and pg_cron sweeps, so they hold even if the web server is down. Server Actions follow guard → validate (Zod) → database function → audit → cache invalidation and return typed results instead of throwing; custom ESLint rules forbid direct updates to order lines and restrict the service-role client to an allow-list.',
        highlights: [
          'Database as the authority: 185 SQL migrations, about 99 RPCs and an invariants SQL suite that runs as a blocking deploy gate.',
          'Self-hosted CD on the VPS: a GitHub Actions runner builds typecheck, lint, test and invariant gates as Docker side stages, deploys with health and SEO canary probes, and rolls back automatically to the last good image.',
          'Secure key vault: application-level AES-256-GCM envelope encryption with tamper detection for delivered keys, a digest pepper for deduplication and signed (Standard Webhooks) payment and email webhooks.',
          'Supplier integration layer with adapters, a registry and preflight checks, plus a currency pipeline with scheduled FX refreshes.',
          'Bilingual SEO engineering: localized routes, a sitemap index, a host guard that noindexes non-canonical hosts, IndexNow and a robots canary in CI.',
          'AI-assisted catalog enrichment and translation through OpenRouter, with schema-validated output and evals.',
          'About 4,000 Vitest cases on pure functions (open-redirect guard, envelope tamper detection, fulfilment parsing, i18n link audit…).',
        ],
      },
      es: {
        title: { base: 'Synth', accent: 'Keys' },
        summary:
          'Tienda full stack en Next.js 16 sobre Supabase donde Postgres es la autoridad: 99 RPC, transiciones de estado protegidas y CD autoalojado con rollback.',
        overview:
          'Una tienda bilingüe (ES/EN) de productos digitales (claves de juegos, licencias de software, membresías y tarjetas de regalo): los clientes pagan con Whop y reciben sus claves en una bóveda cifrada dentro de su cuenta, los pedidos a proveedores se cumplen de forma automática y los regalos se entregan por enlace. Una sola app de Next.js sirve la tienda, un amplio panel de administración y su propia API mediante Server Actions y Route Handlers, sobre Supabase (Postgres, Auth, Storage y pg_cron).',
        architecture:
          '“La autoridad vive en Postgres”: invariantes de negocio como la máquina de estados de las líneas de pedido, los reembolsos y el stock se aplican dentro de la base de datos mediante unas 99 funciones RPC, con 16 transiciones protegidas como funciones SECURITY DEFINER, row-level security en todas partes y barridos con pg_cron, así que se cumplen incluso si el servidor web está caído. Las Server Actions siguen el patrón guard → validación (Zod) → función de base de datos → auditoría → invalidación de caché y devuelven resultados tipados en lugar de lanzar excepciones; reglas propias de ESLint prohíben actualizar directamente las líneas de pedido y restringen el cliente service-role a una lista permitida.',
        highlights: [
          'La base de datos como autoridad: 185 migraciones SQL, unas 99 RPC y una suite SQL de invariantes que se ejecuta como requisito bloqueante del despliegue.',
          'CD autoalojado en el VPS: un runner de GitHub Actions construye los chequeos de tipos, lint, tests e invariantes como etapas laterales de Docker, despliega con sondas de salud y un canario de SEO, y hace rollback automático a la última imagen buena.',
          'Bóveda de claves segura: cifrado de sobre AES-256-GCM a nivel de aplicación con detección de manipulación para las claves entregadas, un pepper de digest para deduplicar y webhooks de pago y de correo firmados (Standard Webhooks).',
          'Capa de integración con proveedores con adaptadores, registro y verificaciones previas, además de un pipeline de monedas con actualización programada de las tasas de cambio.',
          'SEO bilingüe: rutas localizadas, índice de sitemaps, un guard de host que marca como noindex los hosts no canónicos, IndexNow y un canario de robots en la CI.',
          'Enriquecimiento y traducción del catálogo asistidos por IA con OpenRouter, con salida validada por esquema y evaluaciones.',
          'Unos 4.000 casos de Vitest sobre funciones puras (guard contra open redirect, detección de manipulación del sobre, parsing de fulfilment, auditoría de enlaces i18n…).',
        ],
      },
    },
  },

  /* ---------- Mundial 2026 ---------- */
  {
    slug: 'mundial',
    product: 'mundial',
    part: 'frontend',
    kind: 'web',
    category: 'personal',
    accent: 'lime',
    captions: {
      cover: { en: 'Personal tournament recap', es: 'Resumen personal del torneo' },
      '01': { en: 'Sign-in', es: 'Inicio de sesión' },
      '02': { en: 'Ranking', es: 'Tabla de posiciones' },
      '03': { en: 'Knockout bracket', es: 'Cuadro de eliminatorias' },
      '04': { en: 'Predictions center', es: 'Centro de predicciones' },
      '05': { en: 'Game rules', es: 'Reglas del juego' },
      '06': { en: 'Group standings', es: 'Posiciones por grupo' },
    },
    team: 'group',
    stack: {
      languages: ['typescript'],
      frameworks: [
        { tech: 'react', label: 'React 18' },
        { tech: 'vite', label: 'Vite 4' },
      ],
      libraries: [
        { tech: 'tailwind', label: 'Tailwind CSS 3' },
        { label: 'React Router 6' },
        { tech: 'zustand', label: 'Zustand 4' },
        'axios',
        'framerMotion',
        { label: 'Sonner' },
      ],
      infrastructure: ['docker', 'nginx', 'traefik', 'woodpecker'],
    },
    chips: [
      { tech: 'react', label: 'React 18' },
      'vite',
      'typescript',
      'tailwind',
      'zustand',
      'docker',
    ],
    copy: {
      en: {
        title: { base: 'Mundial 2026 ', accent: 'Predictions' },
        summary:
          'Mobile-first React 18 + Vite SPA for a World Cup 2026 prediction pool: live scores, a knockout bracket, rankings and peer-to-peer bets.',
        overview:
          'The front end of a private World Cup 2026 prediction pool: players predict match scores, follow live status, the bracket and standings, check rankings and their prediction history and challenge each other with one-to-one bets, while admins manage users from a panel. It ran during the tournament, which is now over.',
        architecture:
          'Page-per-route React SPA with React Router (protected layout and admin guard), a Zustand auth store and an Axios client with a bearer-token interceptor; data refreshes by polling about every two minutes. It is served by nginx from a multi-stage Docker image with SPA fallback, gzip, security headers, immutable asset caching and a same-origin /api proxy to the backend container, behind Traefik.',
        highlights: [
          'Knockout bracket without horizontal scroll, stage tabs, standings and live match status fed by the official tournament data.',
          "Prediction UX with a custom score stepper, an edit cutoff enforced to the exact minute even if the page stays open, and everyone's predictions revealed when a match locks.",
          'Domain-specific rendering: regulation-time score vs. extra time vs. penalties, and a champion celebration animation.',
          'Development match simulator (live → half time → extra time → penalties → full time) that drives the real scoring pipeline.',
          'Heavily animated with Framer Motion, with a versioned in-app changelog and Sonner toasts.',
          'Continuous deployment with Woodpecker CI: pushes to main that touch the front end trigger an SSH deploy that rebuilds its container.',
        ],
      },
      es: {
        title: { base: 'Mundial 2026 ', accent: 'Pronósticos' },
        summary:
          'SPA mobile-first en React 18 + Vite para un juego de pronósticos del Mundial 2026: marcadores en vivo, cuadro de eliminatorias, rankings y apuestas entre usuarios.',
        overview:
          'El front end de un juego privado de pronósticos del Mundial 2026: los jugadores pronostican marcadores, siguen el estado en vivo, el cuadro y las posiciones, consultan los rankings y su historial de pronósticos y se retan con apuestas uno a uno, mientras los administradores gestionan usuarios desde un panel. Funcionó durante el torneo, que ya terminó.',
        architecture:
          'SPA en React con una página por ruta, React Router (layout protegido y guard de administrador), un store de autenticación en Zustand y un cliente Axios con interceptor de bearer token; los datos se refrescan por polling cada dos minutos aproximadamente. Se sirve con nginx desde una imagen Docker multi-stage con fallback de SPA, gzip, headers de seguridad, caché inmutable de assets y un proxy /api del mismo origen hacia el contenedor del backend, detrás de Traefik.',
        highlights: [
          'Cuadro de eliminatorias sin scroll horizontal, pestañas por fase, tabla de posiciones y estado de los partidos en vivo alimentados con los datos oficiales del torneo.',
          'UX de pronósticos con un selector de marcador propio, cierre de edición aplicado al minuto exacto aunque la página siga abierta y revelado de los pronósticos de todos cuando el partido se bloquea.',
          'Renderizado específico del dominio: marcador del tiempo reglamentario frente a prórroga y penales, y una animación de celebración del campeón.',
          'Simulador de partidos para desarrollo (en vivo → entretiempo → prórroga → penales → final) que ejecuta el pipeline real de puntuación.',
          'Muy animada con Framer Motion, con changelog versionado dentro de la app y toasts con Sonner.',
          'Despliegue continuo con Woodpecker CI: cada push a main que toca el front end lanza un despliegue por SSH que reconstruye su contenedor.',
        ],
      },
    },
  },
  {
    slug: 'mundial-api',
    product: 'mundial',
    part: 'backend',
    kind: 'backend',
    category: 'personal',
    accent: 'green',
    team: 'group',
    stack: {
      languages: ['typescript'],
      frameworks: [
        { tech: 'nodejs', label: 'Node.js 20' },
        { tech: 'express', label: 'Express 4' },
      ],
      libraries: ['drizzle', 'jwt', { label: 'bcryptjs' }, 'axios', { label: 'node-cron' }, { label: 'Brevo (email)' }],
      databases: [{ tech: 'postgresql', label: 'PostgreSQL 16' }],
      infrastructure: [
        { tech: 'docker', label: 'Docker Compose' },
        'traefik',
        'woodpecker',
        { tech: 'cloudflare', label: 'Cloudflare Tunnel' },
        { label: 'Raspberry Pi' },
      ],
      testing: [{ tech: 'jest', label: 'Jest 29' }],
    },
    chips: [
      { tech: 'express', label: 'Express 4' },
      { tech: 'nodejs', label: 'Node.js 20' },
      'drizzle',
      { tech: 'postgresql', label: 'PostgreSQL 16' },
      'docker',
      'jest',
    ],
    copy: {
      en: {
        title: { base: 'Mundial 2026 ', accent: 'API' },
        summary:
          'Express + Drizzle + PostgreSQL 16 API with a pure scoring engine and an adaptive cron that syncs official match data idempotently.',
        overview:
          'The backend of the World Cup 2026 prediction pool: JWT authentication with email activation, predictions with locking rules, a scoring engine with phase multipliers, one-to-one bets with proportional payouts, rankings and bulk admin operations. A cron inside the same process syncs the 104-match calendar and the standings from the official tournament API and pushes final results through scoring and payouts.',
        architecture:
          'Express 4 with TypeScript, organized in feature folders (users, predictions, bets, matches, scoring, config, fixtures, admin, dev, email) with a controller/service split, a central AppError, an async handler and auth middleware. Drizzle ORM on PostgreSQL 16, with idempotent runtime migrations at boot. The stack runs as containers behind Traefik on a self-hosted server and is deployed by Woodpecker CI over SSH.',
        highlights: [
          'Official-data sync: fetch with retries on timeouts and 5xx, transformers, upserts by a stable match id and an adaptive schedule (every 2 minutes when a match is live or imminent, about 10 minutes in quiet hours) with a pause flag.',
          'Scoring engine as a pure, database-free module: exact-score, team-goal and winner/draw points with phase multipliers, always computed on the regulation-time result.',
          'Idempotent result pipeline: scoring and bet payouts run only when a result actually changes, so repeated syncs never pay twice.',
          'Peer-to-peer bets with request/accept states and winner payouts, plus a prediction audit log.',
          'Safe dev tooling: the match simulator only mounts on an explicit development allow-list, and fixture endpoints are blocked in production.',
          'Jest unit tests for the API client, transformers, sync job and match-time logic; path-filtered Woodpecker pipelines per sub-project.',
        ],
      },
      es: {
        title: { base: 'Mundial 2026 ', accent: 'API' },
        summary:
          'API en Express + Drizzle + PostgreSQL 16 con un motor de puntuación puro y un cron adaptativo que sincroniza los datos oficiales de los partidos de forma idempotente.',
        overview:
          'El backend del juego de pronósticos del Mundial 2026: autenticación JWT con activación por correo, pronósticos con reglas de bloqueo, un motor de puntuación con multiplicadores por fase, apuestas uno a uno con pagos proporcionales, rankings y operaciones masivas de administración. Un cron dentro del mismo proceso sincroniza el calendario de 104 partidos y las posiciones desde la API oficial del torneo y lleva los resultados finales a la puntuación y los pagos.',
        architecture:
          'Express 4 con TypeScript, organizado en carpetas por feature (usuarios, pronósticos, apuestas, partidos, puntuación, configuración, fixtures, administración, desarrollo, correo) con separación entre controlador y servicio, un AppError central, un async handler y middleware de autenticación. Drizzle ORM sobre PostgreSQL 16, con migraciones idempotentes al arrancar. El stack corre en contenedores detrás de Traefik en un servidor autoalojado y se despliega con Woodpecker CI por SSH.',
        highlights: [
          'Sincronización con datos oficiales: peticiones con reintentos ante timeouts y errores 5xx, transformadores, upserts por un id de partido estable y una frecuencia adaptativa (cada 2 minutos si hay un partido en vivo o por empezar, unos 10 minutos en horas tranquilas) con bandera de pausa.',
          'Motor de puntuación como módulo puro, sin base de datos: puntos por marcador exacto, goles por equipo y ganador o empate con multiplicadores por fase, siempre sobre el resultado del tiempo reglamentario.',
          'Pipeline de resultados idempotente: la puntuación y los pagos de apuestas solo se ejecutan cuando un resultado cambia de verdad, así que las sincronizaciones repetidas nunca pagan doble.',
          'Apuestas entre usuarios con estados de solicitud y aceptación y pago al ganador, más un log de auditoría de pronósticos.',
          'Herramientas de desarrollo seguras: el simulador de partidos solo se monta en una lista explícita de entornos de desarrollo y los endpoints de fixtures están bloqueados en producción.',
          'Tests unitarios con Jest para el cliente de la API, los transformadores, el job de sincronización y la lógica del tiempo de partido; pipelines de Woodpecker filtrados por ruta para cada subproyecto.',
        ],
      },
    },
  },

  /* ---------- Media Center ---------- */
  {
    slug: 'media-center',
    product: 'media-center',
    part: 'frontend',
    kind: 'web',
    category: 'personal',
    accent: 'amber',
    cover: '02',
    captions: {
      '01': { en: 'Sign-in with GitHub or Google', es: 'Inicio de sesión con GitHub o Google' },
      '02': { en: 'Home', es: 'Inicio' },
      '03': { en: 'Icon gallery', es: 'Galería de íconos' },
    },
    stack: {
      languages: [{ tech: 'typescript', label: 'TypeScript 5.9' }],
      frameworks: [{ tech: 'angular', label: 'Angular 20' }],
      libraries: [
        { tech: 'primeng', label: 'PrimeNG 20' },
        { tech: 'tailwind', label: 'Tailwind CSS 4' },
        { tech: 'rxjs', label: 'RxJS 7' },
        { tech: 'angular', label: 'Angular Signals' },
      ],
      databases: [{ tech: 'supabase', label: 'Supabase Auth' }],
      infrastructure: ['awsS3'],
      testing: ['jasmine', 'karma'],
    },
    chips: [
      { tech: 'angular', label: 'Angular 20' },
      'typescript',
      'primeng',
      { tech: 'tailwind', label: 'Tailwind CSS 4' },
      'supabase',
      'awsS3',
    ],
    copy: {
      en: {
        title: { base: 'Media ', accent: 'Center' },
        summary:
          'Angular 20 asset and icon library with signal-based state, Supabase OAuth and direct-to-S3 uploads through presigned URLs.',
        overview:
          'A media center where signed-in users organize images, videos and files into projects and browse a categorized Material icon catalog. The UI is built with standalone components, PrimeNG and Tailwind 4: a project and asset gallery with multi-file upload dialogs and a details drawer, an icon gallery with a category sidebar, and a home page.',
        architecture:
          'Angular 20 organized into core (guards, interceptors, models, services), features (asset gallery, auth, home, icon gallery) and shared layout components. Global auth state is a signals-only store persisted in sessionStorage; functional guards protect the routes and a functional HTTP interceptor attaches the bearer token for the NestJS API.',
        highlights: [
          'Signals-only global store with sessionStorage persistence, token-expiry validation with a 5-minute buffer and scheduled refresh.',
          'Direct-to-S3 upload pipeline: a presigned URL from the API, uploads with progress events and a concurrency limit, then server-side confirmation.',
          'Google and GitHub OAuth through Supabase, with a callback route and device-aware handling.',
          'Responsive gallery with a mobile sidebar, card and list views, a details dialog and project creation.',
          'Material icon catalog recategorized from a JSON file, with a detail drawer.',
          'PrimeNG 20 theming with a custom preset on Tailwind 4; 24 Karma/Jasmine spec files.',
        ],
      },
      es: {
        title: { base: 'Media ', accent: 'Center' },
        summary:
          'Biblioteca de recursos e íconos en Angular 20 con estado basado en signals, OAuth con Supabase y subidas directas a S3 mediante URLs prefirmadas.',
        overview:
          'Un media center donde los usuarios autenticados organizan imágenes, videos y archivos en proyectos y exploran un catálogo categorizado de íconos de Material. La UI usa componentes standalone, PrimeNG y Tailwind 4: una galería de proyectos y recursos con diálogos de carga múltiple y un panel de detalles, una galería de íconos con barra lateral de categorías y una página de inicio.',
        architecture:
          'Angular 20 organizado en core (guards, interceptors, modelos, servicios), features (galería de recursos, autenticación, inicio, galería de íconos) y componentes de layout compartidos. El estado global de autenticación es un store solo con signals persistido en sessionStorage; guards funcionales protegen las rutas y un interceptor HTTP funcional agrega el bearer token para la API en NestJS.',
        highlights: [
          'Store global solo con signals, persistido en sessionStorage, con validación de expiración del token con 5 minutos de margen y refresh programado.',
          'Pipeline de subida directa a S3: URL prefirmada desde la API, subidas con eventos de progreso y límite de concurrencia, y luego confirmación en el servidor.',
          'OAuth con Google y GitHub mediante Supabase, con ruta de callback y manejo según el tipo de dispositivo.',
          'Galería responsive con barra lateral móvil, vistas de tarjetas y de lista, diálogo de detalles y creación de proyectos.',
          'Catálogo de íconos de Material recategorizado desde un archivo JSON, con panel de detalle.',
          'Theming de PrimeNG 20 con un preset propio sobre Tailwind 4; 24 archivos de specs con Karma y Jasmine.',
        ],
      },
    },
  },
  {
    slug: 'media-center-api',
    product: 'media-center',
    part: 'backend',
    kind: 'backend',
    category: 'personal',
    accent: 'orange',
    stack: {
      languages: [{ tech: 'typescript', label: 'TypeScript 5.7' }],
      frameworks: ['nodejs', { tech: 'nestjs', label: 'NestJS 11' }],
      libraries: [
        { tech: 'passport', label: 'Passport JWT' },
        { label: 'class-validator' },
        { tech: 'aws', label: 'AWS SDK v3 (S3 presigner)' },
      ],
      databases: [{ tech: 'supabase', label: 'Supabase (PostgreSQL)' }],
      infrastructure: ['awsS3'],
      testing: [{ tech: 'jest', label: 'Jest 30' }, { label: 'supertest' }, { tech: 'eslint', label: 'ESLint 9' }],
    },
    chips: [{ tech: 'nestjs', label: 'NestJS 11' }, 'typescript', 'supabase', 'awsS3', 'passport', 'jest'],
    copy: {
      en: {
        title: { base: 'Media Center ', accent: 'API' },
        summary:
          'NestJS 11 API that validates Supabase JWTs and issues presigned S3 upload URLs, persisting a file only after S3 confirms it.',
        overview:
          'A small REST API for the media center: CRUD for projects and resources, presigned upload URLs and upload confirmation, with metadata in Supabase Postgres and files in an S3 bucket. Authentication is stateless: Supabase-issued JWTs validated with Passport, plus a role guard.',
        architecture:
          'Feature modules (auth, users, projects, resources) on a common layer with JWT and role guards, @Roles and @CurrentUser decorators, a transform interceptor for a uniform ApiResponse<T> envelope and an HTTP exception filter. Data access uses the Supabase client with typed row interfaces and no ORM, and DTOs are validated in whitelist and transform mode.',
        highlights: [
          'Two-phase presigned upload: the database row is written only after S3 confirms the object exists (HeadObject), so there are no orphan records.',
          'Ownership checks before issuing URLs: the project must belong to the requesting user, on top of the guards.',
          'Supabase JWT validation with passport-jwt and a role guard, with no server-side session state.',
          'A uniform success and error envelope consumed by a typed front end.',
          'URL expiry and size/type limits shared in configuration with the front end; Jest and supertest specs.',
        ],
      },
      es: {
        title: { base: 'Media Center ', accent: 'API' },
        summary:
          'API en NestJS 11 que valida JWT de Supabase y emite URLs prefirmadas de S3, y guarda un archivo solo después de que S3 lo confirma.',
        overview:
          'Una API REST pequeña para el media center: CRUD de proyectos y recursos, URLs de subida prefirmadas y confirmación de subidas, con metadatos en Supabase Postgres y archivos en un bucket de S3. La autenticación no guarda estado: JWT emitidos por Supabase y validados con Passport, más un guard de roles.',
        architecture:
          'Módulos por feature (auth, users, projects, resources) sobre una capa común con guards de JWT y de roles, decoradores @Roles y @CurrentUser, un interceptor que envuelve todas las respuestas en un ApiResponse<T> uniforme y un filtro de excepciones HTTP. El acceso a datos usa el cliente de Supabase con interfaces de filas tipadas y sin ORM, y los DTO se validan en modo whitelist y transform.',
        highlights: [
          'Subida prefirmada en dos fases: la fila en la base de datos solo se escribe después de que S3 confirma que el objeto existe (HeadObject), así que no quedan registros huérfanos.',
          'Verificación de propiedad antes de emitir URLs: el proyecto debe pertenecer al usuario que la pide, además de los guards.',
          'Validación de JWT de Supabase con passport-jwt y un guard de roles, sin estado de sesión en el servidor.',
          'Un formato uniforme de éxito y error consumido por un front end tipado.',
          'Expiración de URLs y límites de tamaño y tipo compartidos en la configuración con el front end; specs con Jest y supertest.',
        ],
      },
    },
  },

  /* ---------- Earlier projects ---------- */
  {
    slug: 'web-remember',
    product: 'web-remember',
    part: 'frontend',
    kind: 'web',
    category: 'personal',
    accent: 'blue',
    links: { live: 'https://webremember.com/' },
    stack: {
      languages: ['typescript'],
      frameworks: [
        { tech: 'nextjs', label: 'Next.js 15' },
        { tech: 'react', label: 'React 19' },
      ],
      libraries: [
        'tailwind',
        { tech: 'zustand', label: 'Zustand 5' },
        'reactHookForm',
        'zod',
        'radix',
        'framerMotion',
        { label: 'Recharts' },
      ],
      infrastructure: ['docker', { tech: 'github', label: 'GHCR' }, 'semanticRelease'],
      testing: [{ tech: 'jest', label: 'Jest 30' }],
    },
    chips: [{ tech: 'nextjs', label: 'Next.js 15' }, { tech: 'react', label: 'React 19' }, 'typescript', 'tailwind', 'zustand', 'zod'],
    copy: {
      en: {
        title: { base: 'Web ', accent: 'Remember' },
        summary: 'Web platform for centralized URL management, accessible from anywhere.',
        overview:
          'Web platform for centralized URL management, accessible from anywhere. It allows users to organize and save links to optimize access to relevant information.',
        architecture:
          'Next.js App Router front end with React 19, Tailwind CSS, Zustand and React Hook Form with Zod, backed by the Web Remember API (NestJS + Prisma + PostgreSQL) for URL management and communication with users and the development team.',
        highlights: [
          'Centralized URL management, accessible from anywhere.',
          'Links organized and saved for quick access to relevant information.',
        ],
      },
      es: {
        title: { base: 'Web ', accent: 'Remember' },
        summary: 'Plataforma web para gestión centralizada de URLs, accesible desde cualquier lugar.',
        overview:
          'Plataforma web para gestión centralizada de URLs, accesible desde cualquier lugar. Permite organizar y guardar enlaces para optimizar el acceso a información relevante.',
        architecture:
          'Front end en Next.js (App Router) con React 19, Tailwind CSS, Zustand y React Hook Form con Zod, respaldado por la API Web Remember (NestJS + Prisma + PostgreSQL) para la gestión de URLs y la comunicación con los usuarios y el equipo de desarrollo.',
        highlights: [
          'Gestión centralizada de URLs, accesible desde cualquier lugar.',
          'Enlaces organizados y guardados para acceder rápido a información relevante.',
        ],
      },
    },
  },
  {
    slug: 'web-remember-api',
    product: 'web-remember',
    part: 'backend',
    kind: 'backend',
    category: 'personal',
    accent: 'indigo',
    captions: {
      cover: { en: 'Swagger UI: health and auth endpoints', es: 'Swagger UI: endpoints de salud y autenticación' },
      '01': { en: 'Swagger UI: links, profile and profiling endpoints', es: 'Swagger UI: endpoints de enlaces, perfil y perfilamiento' },
    },
    stack: {
      languages: ['typescript'],
      frameworks: [
        { tech: 'nodejs', label: 'Node.js 22' },
        { tech: 'nestjs', label: 'NestJS 11' },
      ],
      libraries: [
        { tech: 'prisma', label: 'Prisma 5' },
        'passport',
        'jwt',
        { label: 'argon2' },
        { label: 'Joi' },
        { label: 'Helmet' },
        'nodemailer',
        'swagger',
      ],
      databases: [{ tech: 'postgresql', label: 'PostgreSQL 16' }],
      infrastructure: ['docker', 'githubActions', { tech: 'github', label: 'GHCR' }, 'semanticRelease'],
      testing: [{ tech: 'jest', label: 'Jest 30' }, { label: 'supertest' }, 'postman'],
    },
    chips: [
      { tech: 'nestjs', label: 'NestJS 11' },
      'typescript',
      'prisma',
      { tech: 'postgresql', label: 'PostgreSQL 16' },
      'docker',
      'jest',
    ],
    copy: {
      en: {
        title: { base: 'Web Remember ', accent: 'API' },
        summary:
          'NestJS 11 + Prisma + PostgreSQL 16 API with rotating refresh sessions, email OTP, Google/GitHub OAuth and layered abuse protection.',
        overview:
          'The REST API behind Web Remember, a "digital memory" for saving links, organizing them in folders and remembering them: authentication, folders, links, profile, a step-by-step profiling wizard, feedback, support and newsletter, plus transactional email. 98 TypeScript files, 26 unit and e2e spec files and about 38 business endpoints documented with Swagger and a Postman collection.',
        architecture:
          'Modular NestJS: one module per domain with controller, service and DTOs, plus a common layer for decorators, a domain exception, filters, guards and interceptors. A response interceptor wraps every success, and a domain exception with a catch-all filter shapes every error with stable codes. configureApp() is extracted so the e2e tests boot exactly the same pipeline as production. Prisma 5 on PostgreSQL 16 across 3 migrations, with configuration validated by Joi at boot.',
        highlights: [
          'Refresh-token sessions done properly: server-side session rows with a SHA-256-hashed token, rotation that rejects replayed tokens, revocation, user-agent/IP metadata, httpOnly cookies and CORS credentials locked to the front end.',
          'Layered abuse protection: a global throttler plus domain limits on OTP, password-reset requests, daily feedback/support caps and newsletter sign-ups, covered by a dedicated hardening e2e suite.',
          'Email OTP verification, password reset and Google/GitHub OAuth account linking through Passport strategies; argon2 password hashing.',
          'Fail-fast configuration with Joi, Swagger tags and bearer auth across all controllers, and a Postman collection kept in the repository.',
          'CI applies migrations and runs the e2e suites against a real PostgreSQL service; a Docker build gate on pull requests; semantic-release publishes images to GHCR.',
          'Multi-stage, non-root Docker image with a health check; Conventional Commits with commitlint, commitizen and Husky.',
        ],
      },
      es: {
        title: { base: 'API ', accent: 'Web Remember' },
        summary:
          'API en NestJS 11 + Prisma + PostgreSQL 16 con sesiones de refresh rotativo, OTP por correo, OAuth con Google y GitHub y protección contra abuso por capas.',
        overview:
          'La API REST detrás de Web Remember, una “memoria digital” para guardar enlaces, organizarlos en carpetas y recordarlos: autenticación, carpetas, enlaces, perfil, un asistente de perfilamiento paso a paso, feedback, soporte y newsletter, además de correo transaccional. 98 archivos de TypeScript, 26 archivos de specs unitarias y e2e y unos 38 endpoints de negocio documentados con Swagger y una colección de Postman.',
        architecture:
          'NestJS modular: un módulo por dominio con controlador, servicio y DTO, más una capa común con decoradores, una excepción de dominio, filtros, guards e interceptores. Un interceptor de respuesta envuelve cada éxito, y una excepción de dominio con un filtro general da forma a cada error con códigos estables. configureApp() está extraído para que los tests e2e arranquen exactamente el mismo pipeline que producción. Prisma 5 sobre PostgreSQL 16 en 3 migraciones, con la configuración validada con Joi al arrancar.',
        highlights: [
          'Sesiones con refresh token bien hechas: filas de sesión en el servidor con el token en hash SHA-256, rotación que rechaza tokens reutilizados, revocación, metadatos de user-agent e IP, cookies httpOnly y credenciales CORS restringidas al front end.',
          'Protección contra abuso por capas: un throttler global más límites por dominio en OTP, solicitudes de restablecimiento de contraseña, topes diarios de feedback y soporte y suscripciones al newsletter, cubiertos por una suite e2e de endurecimiento.',
          'Verificación de correo con OTP, restablecimiento de contraseña y vinculación de cuentas de Google y GitHub mediante estrategias de Passport; contraseñas con hash argon2.',
          'Configuración que falla rápido con Joi, tags de Swagger y autenticación bearer en todos los controladores, y una colección de Postman en el repositorio.',
          'La CI aplica las migraciones y ejecuta los e2e contra un servicio PostgreSQL real; build de Docker obligatorio en los pull requests; semantic-release publica las imágenes en GHCR.',
          'Imagen Docker multi-stage sin root con health check; Conventional Commits con commitlint, commitizen y Husky.',
        ],
      },
    },
  },
  {
    slug: 'informporcinos',
    product: 'informporcinos',
    part: 'frontend',
    kind: 'web',
    category: 'work',
    accent: 'vermilion',
    links: { live: 'https://www.infoporcinos.com/' },
    stack: {
      languages: ['typescript'],
      frameworks: ['nextjs'],
      libraries: ['materialUi'],
    },
    copy: {
      en: {
        title: { base: 'InformPorcinos® ', accent: 'Website' },
        summary: 'Information Platform and Traceability System for the Meat Sector.',
        overview: 'Information Platform and Traceability System for the Meat Sector.',
        highlights: ['Information platform for the meat sector.', 'Traceability system.'],
      },
      es: {
        title: { base: 'Pagina Web ', accent: 'InformPorcinos®' },
        summary: 'Plataforma de Información y Sistema de Trazabilidad para el Sector Cárnico.',
        overview: 'Plataforma de Información y Sistema de Trazabilidad para el Sector Cárnico.',
        highlights: ['Plataforma de información para el sector cárnico.', 'Sistema de trazabilidad.'],
      },
    },
  },
  {
    slug: 'aldental-orders',
    product: 'aldental-orders',
    part: 'frontend',
    kind: 'web',
    category: 'work',
    accent: 'violet',
    stack: {
      languages: ['typescript'],
      frameworks: ['nextjs'],
      libraries: ['materialUi', 'axios'],
    },
    copy: {
      en: {
        title: { base: 'Aldental - ', accent: 'Purchase Order Management' },
        summary: 'Application to upload and validate purchase orders from Excel files.',
        overview:
          "Application to upload and validate purchase orders from Excel files. It generates files in '.txt' format for SIESA and detects validation errors in prices and shipping points. The data is managed through an API and stored in the database.",
        architecture:
          'Next.js client with Material UI that sends the orders through Axios to the Aldental purchase-order API, which validates them and stores them in the database.',
        highlights: [
          'Upload and validation of purchase orders from Excel files.',
          "Generation of '.txt' files for SIESA.",
          'Detection of validation errors in prices and shipping points.',
        ],
      },
      es: {
        title: { base: 'Aldental - ', accent: 'Gestión de Órdenes de Compra' },
        summary: 'Aplicación para cargar y validar órdenes de compra a partir de archivos Excel.',
        overview:
          "Aplicación para cargar y validar órdenes de compra a partir de archivos Excel. Genera archivos en formato '.txt' para SIESA y detecta errores de validación en precios y puntos de envío. Los datos se gestionan a través de una API y se almacenan en la base de datos.",
        architecture:
          'Cliente en Next.js con Material UI que envía las órdenes mediante Axios a la API de órdenes de compra de Aldental, que las valida y las almacena en la base de datos.',
        highlights: [
          'Carga y validación de órdenes de compra desde archivos Excel.',
          "Generación de archivos '.txt' para SIESA.",
          'Detección de errores de validación en precios y puntos de envío.',
        ],
      },
    },
  },
  {
    slug: 'aldental-orders-api',
    product: 'aldental-orders',
    part: 'backend',
    kind: 'backend',
    category: 'work',
    accent: 'magenta',
    coverBackdrop: '#101010',
    stack: {
      languages: ['typescript'],
      frameworks: ['nodejs', 'nestjs'],
      databases: ['sqlserver'],
    },
    copy: {
      en: {
        title: { base: 'Aldental - ', accent: 'Backend Purchase Order Processing API' },
        summary: 'Backend to process and validate purchase orders from Excel files.',
        overview:
          "Backend to process and validate purchase orders from Excel files, generating SIESA-compliant '.txt' files. Manage data persistence and validate purchase orders, storing them in a centralized database.",
        architecture:
          'NestJS service on Node.js with SQL Server persistence, consumed by the purchase-order management app.',
        highlights: [
          'Processing and validation of purchase orders from Excel files.',
          "Generation of SIESA-compliant '.txt' files.",
          'Validated orders stored in a centralized database.',
        ],
      },
      es: {
        title: { base: 'Aldental - ', accent: 'Backend Procesamiento de Órdenes de Compra API' },
        summary: 'Backend para procesar y validar órdenes de compra desde archivos Excel.',
        overview:
          'Backend para procesar y validar órdenes de compra desde archivos Excel, generando archivos `.txt` compatibles con SIESA. Gestiona la persistencia de datos y valida las órdenes de compra, almacenándolas en una base de datos centralizada.',
        architecture:
          'Servicio NestJS sobre Node.js con persistencia en SQL Server, consumido por la aplicación de gestión de órdenes de compra.',
        highlights: [
          'Procesamiento y validación de órdenes de compra desde archivos Excel.',
          'Generación de archivos `.txt` compatibles con SIESA.',
          'Órdenes validadas almacenadas en una base de datos centralizada.',
        ],
      },
    },
  },
  {
    slug: 'monthly-reports-api',
    product: 'monthly-reports',
    part: 'backend',
    kind: 'backend',
    category: 'work',
    accent: 'teal',
    coverBackdrop: '#101010',
    stack: {
      languages: ['typescript'],
      frameworks: ['nodejs', 'nestjs'],
      libraries: ['reactPdf', 'html', 'css'],
      databases: ['mongodb'],
    },
    copy: {
      en: {
        title: { base: 'Monthly Reports ', accent: 'API' },
        summary: 'An API that generates and sends personalized production reports to your clients.',
        overview:
          'An API that generates and sends personalized production reports to your clients. It collects data, creates PDFs with statistics and analysis, and sends them in bulk via email, including an email template with additional information. Automate, customize, scale, and improve communication with your clients.',
        architecture:
          'NestJS service on Node.js with MongoDB: it collects the production data, renders the PDF reports with React-pdf from HTML/CSS templates and sends them in bulk by email.',
        highlights: [
          'Data collection and PDF reports with statistics and analysis.',
          'Bulk email delivery with an email template carrying additional information.',
          'Automated, customizable and scalable reporting.',
        ],
      },
      es: {
        title: { base: 'API ', accent: 'Reportes Mensuales' },
        summary: 'API que genera y envía reportes personalizados de producción a tus clientes.',
        overview:
          'API que genera y envía reportes personalizados de producción a tus clientes. Recopila datos, crea PDFs con estadísticas y análisis, y los envía masivamente por correo electrónico, incluyendo un email template con información adicional. Automatiza, personaliza, escala y mejora la comunicación con tus clientes.',
        architecture:
          'Servicio NestJS sobre Node.js con MongoDB: recopila los datos de producción, genera los reportes en PDF con React-pdf a partir de plantillas HTML/CSS y los envía masivamente por correo.',
        highlights: [
          'Recopilación de datos y reportes PDF con estadísticas y análisis.',
          'Envío masivo por correo con un email template con información adicional.',
          'Reportes automatizados, personalizables y escalables.',
        ],
      },
    },
  },
] as const satisfies readonly ProjectEntry[];
