<p align="center">
  <img src="https://personal-assets-smv.s3.us-east-2.amazonaws.com/myself-img_3.jpg" width="160" height="160" style="border-radius:50%" alt="Sebastián Mosquera Valencia" />
</p>

<h1 align="center">Sebastián Mosquera Valencia — Portfolio</h1>

<p align="center">
  Systems Engineer & Front-end Developer — personal portfolio (v3).
</p>

<p align="center">
  <a href="https://www.sebastianmv.dev/"><strong>🌐 Live Demo »</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white" alt="Astro" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=black" alt="GSAP" />
  <img src="https://img.shields.io/badge/Lenis-1-000000" alt="Lenis" />
  <img src="https://img.shields.io/badge/pnpm-12-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/Vitest-5-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Docker-GHCR-2496ED?logo=docker&logoColor=white" alt="Docker" />
</p>

---

## Overview

This is my personal portfolio: a landing page showcasing my professional and
academic background as a Systems Engineer and Front-end Developer. It highlights
my skills, work experience, featured projects and testimonials, with sections
for Home, About, Skills, Resume, Projects, Testimonials and Contact.

The site is bilingual (English at `/`, Spanish at `/es/`), supports light and
dark themes, and uses GSAP + Lenis motion with a fixed scroll "rail" that turns
the section names into a live table of contents.

## Tech Stack

| Area            | Technology                                                        |
| --------------- | ----------------------------------------------------------------- |
| Framework       | [Astro 7](https://astro.build/) (prerendered pages)               |
| Server          | [`@astrojs/node`](https://docs.astro.build/en/guides/integrations-guide/node/) standalone (contact API route only) |
| Language        | [TypeScript](https://www.typescriptlang.org/)                     |
| Styling         | Plain CSS with design tokens (no CSS framework)                   |
| Animation       | [GSAP](https://gsap.com/) + [Lenis](https://lenis.darkroom.engineering/) smooth scroll |
| i18n            | Astro i18n routing + typed EN/ES content model                    |
| Icons           | [Iconify](https://iconify.design/) JSON sets, inlined at build time |
| Fonts           | [Fontsource](https://fontsource.org/) (Archivo, Inter, Geist Mono) |
| Images          | `astro:assets` (optimized at build time)                          |
| Email           | [Nodemailer](https://nodemailer.com/) over SMTP                   |
| Rate limiting   | [Redis](https://redis.io/) via [ioredis](https://github.com/redis/ioredis) |
| Testing         | [Vitest](https://vitest.dev/) + [happy-dom](https://github.com/capricorn86/happy-dom), `astro check` |
| Container       | [Docker](https://www.docker.com/) (multi-stage, non-root, Node 22 Alpine) |
| CI/CD           | [GitHub Actions](https://github.com/features/actions) → [GHCR](https://ghcr.io/) |
| Package manager | [pnpm](https://pnpm.io/)                                          |

## Features

- ⚡ Every page prerendered with zero framework runtime shipped to the browser; only the
  contact API runs on the Node server.
- 🌍 Bilingual EN/ES with localized routes and a typed content model.
- 🌗 Animated light/dark theme switch without flash on load.
- 🎞️ GSAP scroll reveals, intro sequence and Lenis smooth scrolling.
- 🧭 Scroll rail with ruler, needle and progress readout as a live table of contents.
- 🗂️ Segmented filters for skills and projects, plus a project detail sheet.
- ♿ Reduced-motion guard and accessible, keyboard-friendly navigation.
- 📨 Contact form that emails me via SMTP, with validation shared by browser and server and a
  Redis rate limit of 3 messages per IP every 24h (Cloudflare-aware client IP).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **>= 22.23.4**
- [pnpm](https://pnpm.io/) **>= 12** (`corepack enable` recommended)

### Installation

```bash
pnpm install
```

### Environment variables

Copy the template and fill in the values:

```bash
cp .env.template .env.development   # used by `pnpm dev`
cp .env.template .env.production    # used with Docker (`--env-file`)
```

| Variable         | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `EMAIL_HOST`     | SMTP host (default `smtp.gmail.com`)                          |
| `EMAIL_PORT`     | SMTP port (default `587` with STARTTLS; `465` uses implicit TLS) |
| `EMAIL_USER`     | SMTP account user                                             |
| `EMAIL_PASS`     | SMTP password (for Gmail, an app password)                    |
| `EMAIL_FROM`     | Sender address (optional, defaults to `EMAIL_USER`)           |
| `EMAIL_RECEIVER` | Inbox that receives contact-form messages                     |
| `REDIS_URL`      | Redis connection string (rate limiting)                       |

> These are **server-side only** (`astro:env` secrets) and are **read at runtime** by the
> Node server: they are never inlined into the build, shipped to the browser or baked into the
> Docker image. If Redis is unset or unreachable the form still sends (the error is logged).

### Run

| Command           | Action                                                  |
| :---------------- | :------------------------------------------------------ |
| `pnpm dev`        | Start the dev server at `localhost:4321`                |
| `pnpm build`      | Build prerendered pages + the Node server into `./dist/` |
| `pnpm preview`    | Preview the production build locally                    |
| `pnpm check`      | Type-check the project (`astro check`)                  |
| `pnpm test`       | Run the test suite once (Vitest)                        |
| `pnpm test:watch` | Run the tests in watch mode                             |

## Running with Docker

Build the image:

```bash
docker build -t smv-portfolio .
```

Run the container, passing secrets at runtime (never bake them into the image):

```bash
docker run -p 3000:3000 --env-file .env.production smv-portfolio

# or inline (placeholder values)
docker run -p 3000:3000 \
  -e EMAIL_USER=you@example.com \
  -e EMAIL_PASS=your_app_password \
  -e EMAIL_RECEIVER=inbox@example.com \
  -e REDIS_URL=redis://default:password@host:6379 \
  smv-portfolio
```

The site is now available at http://localhost:3000 (the server runs `node ./dist/server/entry.mjs`).

## Pulling from GHCR

Published images are available on the GitHub Container Registry:

```bash
docker pull ghcr.io/sebas19957/smv-portfolio:portfolio-v3
```

Available tags:

- `latest` and `X.Y.Z` (from `package.json`): most recent build from `main` (production).
- `portfolio-v3`: most recent build from the `portfolio-v3` branch.
- `sha-<commit>`: a specific commit from `main` or `portfolio-v3`.
- `X.Y.Z` / `X.Y`: released version from a `vX.Y.Z` git tag.

## Project Structure

```text
.
├── .github/workflows/  # CI (check, test, build) and Docker publish to GHCR
├── public/             # Favicons
├── src/
│   ├── app/            # Page container, base layout and the client entry (boots every feature)
│   ├── assets/         # Profile and project images, optimized through astro:assets
│   ├── features/       # Behaviour with its own markup + typed controller
│   │   ├── scroll-rail/        # Ruler, needle, % readout and the section-word flip
│   │   ├── smooth-scroll/      # Lenis on the GSAP ticker
│   │   ├── reveal/             # Scroll reveals + no-flash guard
│   │   ├── intro/              # Load-in clock (nav stagger, rail tick cascade)
│   │   ├── navigation/         # Site nav, mobile menu, language switch, scroll spy
│   │   ├── theme/              # Animated light/dark switch
│   │   ├── collection-filter/  # Segmented filters (skills, projects)
│   │   ├── project-sheet/      # Project detail sheet
│   │   └── contact-form/       # Contact form + shared validation rules
│   │       └── server/         # API logic: client IP, rate limiter, mailer, email template, use case
│   ├── i18n/           # Typed content model, EN/ES copy and locale helpers
│   ├── pages/          # Localized routes (`/` and `/es/`) and `api/send-email.ts` (on-demand)
│   ├── sections/       # One folder per page section
│   ├── shared/         # UI atoms (buttons, chips, section frame, icons) and small libs
│   └── styles/         # Design tokens, base reset and visual-language primitives
├── astro.config.mjs    # Astro config (site URL, i18n routing, Node adapter, env schema)
├── Dockerfile          # Multi-stage build (prod deps only, non-root runner)
├── .env.template       # Environment variable names
├── vitest.config.ts    # Test runner config
└── pnpm-lock.yaml      # pnpm lockfile
```

Copy lives only in `src/i18n/content/` (`en.ts`, `es.ts`, and language-neutral
facts in `profile.ts`).

## CI/CD

| Workflow             | Trigger                                                      | What it does                                   |
| -------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| `ci.yml`             | Push to `portfolio-v3` / `develop`, PR to `develop` / `main` | Install, `pnpm check`, `pnpm test`, `pnpm build` |
| `docker-publish.yml` | Push to `main` / `portfolio-v3`, `v*.*.*` tag                | Run CI, then build & push the image to GHCR    |

## Icon Credits

Skill and social logos are inlined at build time from Iconify JSON sets:
[gilbarbara/logos](https://github.com/gilbarbara/logos) (CC0), [Devicon](https://github.com/devicons/devicon) (MIT),
[Tabler Icons](https://github.com/tabler/tabler-icons) (MIT) and [selfh.st/icons](https://github.com/selfhst/icons)
(CC BY 4.0 — Odoo and Instagram marks). Brand marks remain trademarks of their respective owners.

## Author

**Sebastián Mosquera Valencia** — Systems Engineer & Front-end Developer
[Portfolio](https://www.sebastianmv.dev/)
