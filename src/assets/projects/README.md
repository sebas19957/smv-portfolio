# Project images

Each project has its own folder named after its `slug` in `src/i18n/content/projects.ts`
(for example `web-remember/`). Images are picked up automatically at build time
(`import.meta.glob`) and optimized with `astro:assets` — no code changes needed.

| File name            | Used for                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| `cover.<ext>`        | The project card (16:10 crop; phone frame for `mobile`). Only add it when it is a different image from the gallery. Without it, the card uses `01.<ext>`, or the shot named by the entry's `cover` key (e.g. `cover: '02'`). |
| `01.<ext>`, `02.<ext>` … | Detail-view gallery, ordered by file name (use two digits: `01`, `02`, … `10`). |

Accepted extensions: `png`, `jpg`, `jpeg`, `webp`, `avif`.

What to put in the gallery depends on the project's `kind`:

- `web` — desktop screenshots, ideally 16:10 (e.g. 1600×1000). `01` is the large hero image,
  the rest form the gallery (all open in a lightbox).
- `mobile` — phone screens, ideally 9:19.5 (e.g. 1080×2340), shown side by side in phone frames.
- `backend` — at most one or two images: an architecture diagram and/or the API docs (Swagger).

Empty or missing folders render line-work placeholders labelled "Image coming soon" until
images are added. Use large sources: images are never upscaled.

The card image also leads the detail view (the web hero), followed by the rest of the gallery.
Describe every image in the entry's `captions` (EN + ES, keyed by file name: `cover`, `01`, …):
they become the alt text and the lightbox caption. Prefer WebP (quality ~90, original size).
