# Docker + CI/CD (GHCR) + pnpm Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dockerizar el portafolio Next.js con output standalone, migrar de yarn a pnpm, publicar la imagen a GHCR vía GitHub Actions, corregir el manejo de secretos y profesionalizar el README.

**Architecture:** Imagen Docker multi-stage (deps → builder → runner) sobre `node:22-alpine` usando `output: "standalone"` de Next.js. Dos workflows de GitHub Actions: uno de verificación (lint + build) en cada PR/push a `dev`/`main`, y otro que construye y publica a `ghcr.io/sebas19957/smv-portfolio` solo desde `main` y tags de versión. Toolchain gestionado con pnpm vía corepack.

**Tech Stack:** Next.js 15.1.6, React 19, TypeScript, pnpm 11, Docker (Buildx), GitHub Actions, GHCR.

## Global Constraints

- Gestor de paquetes: **pnpm 11.8.0** (vía `corepack`); prohibido yarn/npm a partir de ahora.
- Node: **22 LTS** en imagen y en `engines` (`>=22`). No usar Node 25 local en la imagen.
- Imagen base: `node:22-alpine`.
- Destino de registry: `ghcr.io/sebas19957/smv-portfolio`.
- **NO** existe carpeta `public/` — el Dockerfile NO debe hacer `COPY` de `public/`.
- Variables de servidor SIN prefijo `NEXT_PUBLIC_` (son runtime env, nunca en bundle ni imagen).
- Publicar imagen SOLO desde `main` y tags `v*.*.*`. `dev` solo verifica.
- README en **inglés**. Foto: `https://personal-assets-smv.s3.us-east-2.amazonaws.com/myself-img_3.jpg`. Demo: `https://www.sebastianmv.dev/`.
- `.env.development` / `.env.production` están gitignored: editar localmente, NO commitear. Solo `.env.template` se commitea.
- Mensajes de commit terminan con `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

### Task 1: Corregir manejo de secretos (quitar `NEXT_PUBLIC_`)

**Files:**
- Modify: `src/lib/redis.ts:4-7`
- Modify: `src/app/api/send-email/route.ts:41-55`
- Modify: `.env.template` (commiteado)
- Modify: `.env.development` (local, NO commitear)
- Modify: `.env.production` (local, NO commitear)

**Interfaces:**
- Consumes: nada (primera tarea).
- Produces: variables de entorno de servidor `REDIS_URL`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_RECEIVER` (sin prefijo). Las consumen el Dockerfile (docs de runtime) y el README (tabla de env).

- [ ] **Step 1: Editar `src/lib/redis.ts`**

Reemplazar las líneas 3-8 (función `getRedisUrl`):

```typescript
const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  throw new Error("REDIS_URL no está definida en las variables de entorno");
};
```

- [ ] **Step 2: Editar `src/app/api/send-email/route.ts`**

Línea 41-42 (auth del transporter):

```typescript
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
```

Línea 54-55 (mailOptions):

```typescript
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
```

- [ ] **Step 3: Reescribir `.env.template`**

Contenido completo:

```
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
EMAIL_RECEIVER=
REDIS_URL=
```

- [ ] **Step 4: Actualizar `.env.development` y `.env.production` localmente**

Renombrar cada clave quitando `NEXT_PUBLIC_` (conservando los valores actuales). NO commitear estos archivos (están en `.gitignore`).

- [ ] **Step 5: Verificar que no quedan referencias `NEXT_PUBLIC_` en código fuente**

Run: `grep -rn "NEXT_PUBLIC_" src/`
Expected: sin resultados (exit code 1).

- [ ] **Step 6: Commit**

```bash
git add src/lib/redis.ts src/app/api/send-email/route.ts .env.template
git commit -m "refactor: drop NEXT_PUBLIC_ prefix from server-only secrets

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Migrar de yarn a pnpm

**Files:**
- Delete: `yarn.lock`
- Delete: `package-lock.json`
- Modify: `package.json` (agregar `packageManager` y `engines`)
- Create: `.npmrc`
- Create: `pnpm-lock.yaml` (generado por `pnpm install`)

**Interfaces:**
- Consumes: nada relevante de Task 1.
- Produces: `pnpm-lock.yaml` (lo consume el Dockerfile en `pnpm install --frozen-lockfile` y los workflows de CI). Campo `packageManager: "pnpm@11.8.0"` (lo lee `corepack`).

- [ ] **Step 1: Habilitar corepack y fijar pnpm**

Run: `corepack enable && corepack prepare pnpm@11.8.0 --activate && pnpm -v`
Expected: imprime `11.8.0`.

- [ ] **Step 2: Eliminar lockfiles antiguos**

```bash
rm -f yarn.lock package-lock.json
```

- [ ] **Step 3: Crear `.npmrc`**

```
node-linker=hoisted
```

- [ ] **Step 4: Agregar `packageManager` y `engines` a `package.json`**

Insertar tras la línea `"private": true,` (mantener el resto idéntico):

```json
  "packageManager": "pnpm@11.8.0",
  "engines": {
    "node": ">=22"
  },
```

- [ ] **Step 5: Generar el lockfile de pnpm e instalar**

Run: `pnpm install`
Expected: crea `pnpm-lock.yaml`, instala sin errores.

- [ ] **Step 6: Verificar que lint y build funcionan con pnpm**

Run: `pnpm lint && pnpm build`
Expected: lint sin errores; build termina con "Compiled successfully" y genera `.next/`.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml .npmrc
git rm --cached yarn.lock package-lock.json 2>/dev/null || true
git commit -m "build: migrate from yarn to pnpm

- remove yarn.lock and stray package-lock.json
- add packageManager (pnpm@11.8.0) and engines (node>=22)
- add .npmrc with node-linker=hoisted for Next.js compatibility

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Habilitar output standalone en Next.js

**Files:**
- Modify: `next.config.ts:3` (dentro de `nextConfig`)

**Interfaces:**
- Consumes: nada.
- Produces: `.next/standalone/server.js` tras `pnpm build` (lo consume el Dockerfile runner).

- [ ] **Step 1: Agregar `output: "standalone"` a `next.config.ts`**

El objeto `nextConfig` debe quedar así (agregar la primera línea `output`):

```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "personal-smv-assets.s3.sa-east-1.amazonaws.com",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};
```

- [ ] **Step 2: Rebuild y verificar que se genera el standalone**

Run: `pnpm build && ls .next/standalone/server.js .next/standalone/node_modules >/dev/null && echo STANDALONE_OK`
Expected: imprime `STANDALONE_OK` (existen `server.js` y `node_modules` dentro de `.next/standalone`).

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "build: enable Next.js standalone output for minimal Docker image

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Crear `.dockerignore`

**Files:**
- Create: `.dockerignore`

**Interfaces:**
- Consumes: nada.
- Produces: contexto de build reducido (lo aprovecha Task 5).

- [ ] **Step 1: Crear `.dockerignore`**

```
node_modules
.next
.git
.github
.gitignore
.env
.env.*
!.env.template
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
yarn.lock
package-lock.json
.vscode
.idea
docs
README.md
*.md
.DS_Store
coverage
Dockerfile
.dockerignore
```

- [ ] **Step 2: Commit**

```bash
git add .dockerignore
git commit -m "build: add .dockerignore to slim and secure Docker build context

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Crear el Dockerfile multi-stage

**Files:**
- Create: `Dockerfile`

**Interfaces:**
- Consumes: `pnpm-lock.yaml` (Task 2), `output: "standalone"` (Task 3), `.dockerignore` (Task 4), variables de runtime de Task 1.
- Produces: imagen ejecutable que sirve en el puerto 3000 vía `node server.js`.

- [ ] **Step 1: Crear `Dockerfile`**

```dockerfile
# syntax=docker/dockerfile:1

# ---- Base ----
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Standalone output: server.js + minimal node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets (JS/CSS chunks) — not included in standalone tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

- [ ] **Step 2: Construir la imagen**

Run: `docker build -t smv-portfolio:test .`
Expected: build completa sin errores; última línea muestra la imagen escrita/tagueada.

- [ ] **Step 3: Verificar el tamaño de la imagen (debe ser pequeña)**

Run: `docker images smv-portfolio:test --format '{{.Size}}'`
Expected: tamaño en cientos de MB (≈150–300 MB), no >1 GB.

- [ ] **Step 4: Levantar el contenedor y probar que responde**

```bash
docker run -d --name smv-test -p 3001:3000 \
  -e REDIS_URL="redis://localhost:6379" \
  -e EMAIL_USER="x" -e EMAIL_PASS="x" -e EMAIL_RECEIVER="x" \
  smv-portfolio:test
sleep 4
curl -sS -o /dev/null -w "%{http_code}" http://localhost:3001/
```
Expected: imprime `200`. (El home no depende de Redis; solo el API route lo usa.)

- [ ] **Step 5: Limpiar el contenedor de prueba**

```bash
docker rm -f smv-test
```

- [ ] **Step 6: Commit**

```bash
git add Dockerfile
git commit -m "feat: add multi-stage Dockerfile using Next.js standalone output

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Workflow de CI (lint + build)

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `pnpm-lock.yaml` + `packageManager` (Task 2).
- Produces: un workflow llamado `CI` con un job `verify` (lo referencia Task 7 vía `workflow_run` o como gate lógico — aquí se usa como check independiente).

- [ ] **Step 1: Crear `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [dev, main]
  pull_request:
    branches: [dev, main]

jobs:
  verify:
    name: Lint & Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build
        env:
          NEXT_TELEMETRY_DISABLED: 1
```

- [ ] **Step 2: Validar la sintaxis YAML**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/ci.yml')); print('YAML_OK')"`
Expected: imprime `YAML_OK`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add lint and build verification workflow

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Workflow de publicación a GHCR

**Files:**
- Create: `.github/workflows/docker-publish.yml`

**Interfaces:**
- Consumes: `Dockerfile` (Task 5), workflow `CI` (Task 6).
- Produces: imagen publicada en `ghcr.io/sebas19957/smv-portfolio` con tags `latest`/`sha-*` (main) y `X.Y.Z`/`X.Y`/`latest` (tags de versión).

- [ ] **Step 1: Crear `.github/workflows/docker-publish.yml`**

```yaml
name: Build and Publish Docker Image

on:
  push:
    branches: [main]
    tags: ["v*.*.*"]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  verify:
    name: Lint & Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build
        env:
          NEXT_TELEMETRY_DISABLED: 1

  build-and-push:
    name: Build and Push to GHCR
    needs: verify
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels)
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=raw,value=latest,enable={{is_default_branch}}
            type=sha,prefix=sha-,enable={{is_default_branch}}
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

- [ ] **Step 2: Validar la sintaxis YAML**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/docker-publish.yml')); print('YAML_OK')"`
Expected: imprime `YAML_OK`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/docker-publish.yml
git commit -m "ci: publish Docker image to GHCR on main and version tags

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: README profesional en inglés

**Files:**
- Modify: `README.md` (reescritura completa)

**Interfaces:**
- Consumes: nombres de env de Task 1, comandos pnpm de Task 2, instrucciones Docker de Task 5, ruta de imagen GHCR de Task 7.
- Produces: documentación final (nada depende de ella).

- [ ] **Step 1: Reescribir `README.md` completo**

```markdown
<p align="center">
  <img src="https://personal-assets-smv.s3.us-east-2.amazonaws.com/myself-img_3.jpg" width="160" height="160" style="border-radius:50%" alt="Sebastián Mosquera Valencia" />
</p>

<h1 align="center">Sebastián Mosquera Valencia — Portfolio</h1>

<p align="center">
  Systems Engineer & Front-end Developer — personal portfolio.
</p>

<p align="center">
  <a href="https://www.sebastianmv.dev/"><strong>🌐 Live Demo »</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-149ECA?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white" alt="Docker" />
</p>

---

## Overview

This is my personal portfolio: a landing page showcasing my professional and
academic background as a Systems Engineer and Front-end Developer. It highlights
my skills, work experience, featured projects and testimonials, with sections
for About, Skills, Summary, Projects, Testimonials and Contact.

The contact form is rate-limited per IP using Redis and delivers messages via
email (Nodemailer). Media assets are served from AWS S3.

## Tech Stack

| Area            | Technology                                              |
| --------------- | ------------------------------------------------------- |
| Framework       | [Next.js 15](https://nextjs.org/) (App Router) + React 19 |
| Language        | [TypeScript](https://www.typescriptlang.org/)           |
| Styling         | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Animation       | [Framer Motion](https://www.framer.com/motion/)         |
| Rate limiting   | [Redis](https://redis.io/) (`ioredis`)                  |
| Email           | [Nodemailer](https://nodemailer.com/)                   |
| Asset storage   | [AWS S3](https://aws.amazon.com/s3/)                    |
| Package manager | [pnpm](https://pnpm.io/)                                |
| Container       | [Docker](https://www.docker.com/) (standalone output)   |
| CI/CD           | [GitHub Actions](https://github.com/features/actions) → [GHCR](https://ghcr.io) |

## Features

- ⚡ Next.js App Router with standalone build for tiny container images.
- 🎨 Responsive UI with Tailwind CSS, shadcn/ui and Framer Motion animations.
- 📨 Contact form with IP-based rate limiting (3 attempts / 24h) backed by Redis.
- ☁️ Media delivered from AWS S3 with optimized image loading.
- 🐳 Production-ready multi-stage Dockerfile.
- 🤖 Automated CI (lint + build) and image publishing to GHCR.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **>= 22**
- [pnpm](https://pnpm.io/) **>= 11** (`corepack enable` recommended)

### Installation

```bash
pnpm install
```

### Environment variables

Copy the template and fill in the values:

```bash
cp .env.template .env.development   # for development
cp .env.template .env.production    # for production
```

| Variable         | Description                                      |
| ---------------- | ------------------------------------------------ |
| `EMAIL_HOST`     | SMTP host (e.g. `smtp.gmail.com`)                |
| `EMAIL_PORT`     | SMTP port (e.g. `465`)                           |
| `EMAIL_USER`     | SMTP / sender account                            |
| `EMAIL_PASS`     | SMTP password or app password                    |
| `EMAIL_FROM`     | "From" address for outgoing mail                 |
| `EMAIL_RECEIVER` | Inbox that receives contact-form messages        |
| `REDIS_URL`      | Redis connection string (rate limiting)          |

> These are **server-side only** and are never exposed to the browser.

### Run

```bash
pnpm dev      # development (http://localhost:3000)
pnpm build    # production build
pnpm start    # serve the production build
```

## Running with Docker

Build the image:

```bash
docker build -t smv-portfolio .
```

Run the container (pass secrets at runtime — never bake them into the image):

```bash
docker run -p 3000:3000 \
  -e EMAIL_HOST=smtp.gmail.com \
  -e EMAIL_PORT=465 \
  -e EMAIL_USER=you@example.com \
  -e EMAIL_PASS=your_app_password \
  -e EMAIL_FROM=you@example.com \
  -e EMAIL_RECEIVER=inbox@example.com \
  -e REDIS_URL=redis://default:password@host:6379 \
  smv-portfolio
```

The app is now available at http://localhost:3000.

## Pulling from GHCR

Published images are available on the GitHub Container Registry:

```bash
docker pull ghcr.io/sebas19957/smv-portfolio:latest
```

Available tags:

- `latest` — most recent build from `main`.
- `sha-<commit>` — specific commit from `main`.
- `X.Y.Z` — released version (from a `vX.Y.Z` git tag).

## Project Structure

```
.
├── .github/workflows/   # CI (lint + build) and Docker publish to GHCR
├── docs/                # Design specs and implementation plans
├── public/ (none)       # Assets are served from AWS S3
├── src/
│   ├── app/             # Next.js App Router (pages + API routes)
│   ├── components/      # UI components
│   └── lib/             # Redis client, email templates, helpers
├── Dockerfile           # Multi-stage build (standalone output)
├── next.config.ts       # Next.js config (standalone, images, svgr)
└── pnpm-lock.yaml       # pnpm lockfile
```

## CI/CD

| Workflow                | Trigger                          | What it does                          |
| ----------------------- | -------------------------------- | ------------------------------------- |
| `ci.yml`                | PR / push to `dev` or `main`     | Install, lint and build               |
| `docker-publish.yml`    | Push to `main` or `v*.*.*` tag   | Verify, then build & push to GHCR     |

## Author

**Sebastián Mosquera Valencia** — Systems Engineer & Front-end Developer
[Portfolio](https://www.sebastianmv.dev/)
```

- [ ] **Step 2: Verificar que el README ya no referencia yarn ni el logo de Nest**

Run: `grep -in "yarn\|nest logo\|logo.png" README.md`
Expected: sin resultados (exit code 1).

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README (English, photo, badges, Docker & GHCR)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 9: Verificación final integral

**Files:** ninguno (solo verificación).

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: confirmación de que el conjunto funciona.

- [ ] **Step 1: Verificar el árbol de trabajo limpio y los archivos esperados**

Run:
```bash
test -f Dockerfile && test -f .dockerignore && test -f pnpm-lock.yaml \
  && test -f .github/workflows/ci.yml && test -f .github/workflows/docker-publish.yml \
  && test ! -f yarn.lock && test ! -f package-lock.json \
  && echo FILES_OK
```
Expected: imprime `FILES_OK`.

- [ ] **Step 2: Build limpio desde cero con Docker (no cache)**

Run: `docker build --no-cache -t smv-portfolio:final .`
Expected: build completa sin errores.

- [ ] **Step 3: Smoke test del contenedor**

```bash
docker run -d --name smv-final -p 3002:3000 \
  -e REDIS_URL="redis://localhost:6379" \
  -e EMAIL_USER="x" -e EMAIL_PASS="x" -e EMAIL_RECEIVER="x" \
  smv-portfolio:final
sleep 4
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3002/
docker rm -f smv-final
```
Expected: imprime `200`.

- [ ] **Step 4: Verificar el historial de commits de la rama**

Run: `git log --oneline dev..HEAD | cat`
Expected: lista los commits de las Tasks 1-8 en orden.

---

## Notas de ejecución

- Si `docker build` falla por permisos del daemon, el ejecutor debe reportarlo (no usar `sudo` sin confirmar con el usuario).
- El push de la rama y la creación del PR NO están en este plan: se harán solo cuando el usuario lo pida explícitamente.
- La publicación real a GHCR ocurre en el servidor de Actions tras hacer merge a `main`; no se prueba localmente.
