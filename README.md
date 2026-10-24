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
| Framework       | [Astro 7](https://astro.build/) (static output)                   |
| Language        | [TypeScript](https://www.typescriptlang.org/)                     |
| Styling         | Plain CSS with design tokens (no CSS framework)                   |
| Animation       | [GSAP](https://gsap.com/) + [Lenis](https://lenis.darkroom.engineering/) smooth scroll |
| i18n            | Astro i18n routing + typed EN/ES content model                    |
| Icons           | [Iconify](https://iconify.design/) JSON sets, inlined at build time |
| Fonts           | [Fontsource](https://fontsource.org/) (Archivo, Inter, Geist Mono) |
| Images          | `astro:assets` (optimized at build time)                          |
| Package manager | [pnpm](https://pnpm.io/)                                          |

## Features

- ⚡ Fully static build with zero framework runtime shipped to the browser.
- 🌍 Bilingual EN/ES with localized routes and a typed content model.
- 🌗 Animated light/dark theme switch without flash on load.
- 🎞️ GSAP scroll reveals, intro sequence and Lenis smooth scrolling.
- 🧭 Scroll rail with ruler, needle and progress readout as a live table of contents.
- 🗂️ Segmented filters for skills and projects, plus a project detail sheet.
- ♿ Reduced-motion guard and accessible, keyboard-friendly navigation.
- 📨 Contact form with localized inline validation (UI only, backend pending).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **>= 22.23.4**
- [pnpm](https://pnpm.io/) **>= 12** (`corepack enable` recommended)

### Installation

```bash
pnpm install
```

### Run

| Command        | Action                                   |
| :------------- | :--------------------------------------- |
| `pnpm dev`     | Start the dev server at `localhost:4321` |
| `pnpm build`   | Build the static site into `./dist/`     |
| `pnpm preview` | Preview the production build locally     |

## Project Structure

```text
.
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
│   │   └── contact-form/       # Contact form (UI only, backend pending)
│   ├── i18n/           # Typed content model, EN/ES copy and locale helpers
│   ├── pages/          # Localized routes (`/` and `/es/`)
│   ├── sections/       # One folder per page section
│   ├── shared/         # UI atoms (buttons, chips, section frame, icons) and small libs
│   └── styles/         # Design tokens, base reset and visual-language primitives
├── astro.config.mjs    # Astro config (site URL, i18n routing)
└── pnpm-lock.yaml      # pnpm lockfile
```

Copy lives only in `src/i18n/content/` (`en.ts`, `es.ts`, and language-neutral
facts in `profile.ts`).

## Icon Credits

Skill and social logos are inlined at build time from Iconify JSON sets:
[gilbarbara/logos](https://github.com/gilbarbara/logos) (CC0), [Devicon](https://github.com/devicons/devicon) (MIT),
[Tabler Icons](https://github.com/tabler/tabler-icons) (MIT) and [selfh.st/icons](https://github.com/selfhst/icons)
(CC BY 4.0 — Odoo and Instagram marks). Brand marks remain trademarks of their respective owners.

## Author

**Sebastián Mosquera Valencia** — Systems Engineer & Front-end Developer
[Portfolio](https://www.sebastianmv.dev/)
