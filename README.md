# SebastiánMV — Portfolio

Personal developer portfolio built with Astro. Bilingual (English at `/`, Spanish at `/es/`), light/dark theme,
GSAP + Lenis motion and a fixed scroll "rail" that turns the section names into a live table of contents.

## Commands

All commands run from the project root with pnpm:

| Command        | Action                                        |
| :------------- | :-------------------------------------------- |
| `pnpm install` | Install dependencies                          |
| `pnpm dev`     | Start the dev server at `localhost:4321`      |
| `pnpm build`   | Build the static site into `./dist/`          |
| `pnpm preview` | Preview the production build locally          |

## Structure

```text
src/
├── app/            Page container, base layout and the client entry (boots every feature)
├── assets/images/  Source images, optimized at build time through astro:assets
├── features/       Behaviour with its own markup + typed controller
│   ├── scroll-rail/        Ruler, needle, % readout and the section-word flip (rail-geometry.ts is pure)
│   ├── smooth-scroll/      Lenis on the GSAP ticker
│   ├── reveal/             Scroll reveals + no-flash guard
│   ├── intro/              Load-in clock (nav stagger, rail tick cascade)
│   ├── navigation/         Site nav, mobile menu, language switch, scroll spy
│   ├── theme/              Animated light/dark switch
│   ├── collection-filter/  Segmented filters (skills, projects)
│   └── contact-form/       Contact form (UI only, no backend yet)
├── i18n/           Typed content model, EN/ES copy and locale helpers
├── sections/       One folder per page section (hero, about, skills, resume, projects, testimonials, contact, footer)
├── shared/         UI atoms (buttons, chips, section frame, eyebrow, icons) and small libs
└── styles/         Design tokens, base reset and visual-language primitives
```

Copy lives only in `src/i18n/content/` (`en.ts`, `es.ts`, and language-neutral facts in `profile.ts`).

## Icon credits

Skill and social logos are inlined at build time from Iconify JSON sets:
[gilbarbara/logos](https://github.com/gilbarbara/logos) (CC0), [Devicon](https://github.com/devicons/devicon) (MIT),
[Tabler Icons](https://github.com/tabler/tabler-icons) (MIT) and [selfh.st/icons](https://github.com/selfhst/icons)
(CC BY 4.0 — Odoo and Instagram marks). Brand marks remain trademarks of their respective owners.
