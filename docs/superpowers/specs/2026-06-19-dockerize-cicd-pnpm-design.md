# Diseño — Docker + CI/CD (GHCR) + migración a pnpm + README

**Fecha:** 2026-06-19
**Rama:** `feat/dockerize-cicd` (creada desde `dev`)
**Repositorio:** `github.com/sebas19957/smv-portfolio`
**Destino de imagen:** `ghcr.io/sebas19957/smv-portfolio`

## Contexto

Portafolio personal en Next.js 15.1.6 (App Router) + React 19 + TypeScript.
Usa `nodemailer` (API route `/api/send-email`) e `ioredis` (`src/lib/redis.ts`),
por lo tanto tiene runtime de servidor: `output: "standalone"` es la opción correcta
para una imagen Docker mínima.

Estado actual del repo relevante:
- Conviven `yarn.lock` **y** `package-lock.json` (residuo a limpiar).
- `next.config.ts` (TypeScript).
- **No existe carpeta `public/`** (los assets se sirven desde AWS S3).
- Los secretos usan prefijo `NEXT_PUBLIC_`, lo que los inlinea en el bundle del
  navegador y en las capas de la imagen — problema de seguridad a corregir.
- No hay `.nvmrc` ni campo `engines`/`packageManager`.

## Objetivos

1. Dockerizar con `output: "standalone"` (imagen mínima multi-stage).
2. CI/CD con GitHub Actions publicando a GHCR.
3. Migrar de yarn a pnpm.
4. Corregir el manejo de secretos (quitar `NEXT_PUBLIC_` de variables de servidor).
5. README profesional en inglés con foto personal y demo en vivo.

## 1. Migración yarn → pnpm

- Eliminar `yarn.lock` y `package-lock.json`.
- `package.json`: agregar `"packageManager": "pnpm@11.8.0"` y
  `"engines": { "node": ">=22" }`.
- Generar `pnpm-lock.yaml` con `pnpm install`.
- Agregar `.npmrc` con `node-linker=hoisted` (máxima compatibilidad con Next.js
  y con el file-tracing del build standalone).
- Reemplazar referencias a yarn por pnpm en README.

## 2. Corrección de secretos (env de servidor)

Todas las lecturas son **solo del lado del servidor**, por lo que el cambio es seguro
(ningún componente de cliente las usa):

| Antes | Después | Archivo |
|-------|---------|---------|
| `NEXT_PUBLIC_REDIS_URL` | `REDIS_URL` | `src/lib/redis.ts` |
| `NEXT_PUBLIC_EMAIL_USER` | `EMAIL_USER` | `src/app/api/send-email/route.ts` |
| `NEXT_PUBLIC_EMAIL_PASS` | `EMAIL_PASS` | `src/app/api/send-email/route.ts` |
| `NEXT_PUBLIC_EMAIL_RECEIVER` | `EMAIL_RECEIVER` | `src/app/api/send-email/route.ts` |

También actualizar `.env.template` (commiteado), `.env.development` y
`.env.production` (gitignored, se editan localmente).

Estas variables pasan a ser **runtime env** (inyectadas en `docker run`), nunca
horneadas en la imagen ni en el bundle.

## 3. Docker (standalone, multi-stage)

- `next.config.ts`: agregar `output: "standalone"`.
- **`Dockerfile`** — 3 etapas sobre `node:22-alpine`:
  1. **deps**: `corepack enable` + `pnpm install --frozen-lockfile`
     (cacheado por `package.json` + `pnpm-lock.yaml`).
  2. **builder**: copiar código, `pnpm build` → genera `.next/standalone`.
  3. **runner**: usuario no-root (`nextjs`), copiar `.next/standalone` y
     `.next/static`. **Sin COPY de `public/`** (no existe). `EXPOSE 3000`,
     `CMD ["node", "server.js"]`. `ENV HOSTNAME=0.0.0.0`.
- **`.dockerignore`**: excluir `node_modules`, `.next`, `.git`, `.env*`, `docs`,
  markdown, etc. → contexto de build pequeño, rápido y sin secretos.
- Resultado: imagen con solo runtime de producción (~150 MB aprox. vs ~1 GB naive).

## 4. CI/CD — `.github/workflows/`

Regla: **verificar en cada push/PR; publicar solo desde `main` y tags de versión.**

- **`ci.yml`** — en PR + push a `dev`/`main`:
  - `pnpm/action-setup` + `actions/setup-node` con cache de pnpm.
  - `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm build`.
- **`docker-publish.yml`** — en push a `main` y tags `v*.*.*`, **tras pasar CI**:
  - `docker/login-action` a GHCR con `GITHUB_TOKEN` (sin secretos manuales).
  - `docker/metadata-action` para tags.
  - `docker/build-push-action` con Buildx + cache de capas (GHA cache).
  - Tags resultantes:
    - push a `main`: `latest`, `sha-<short>`.
    - tag `vX.Y.Z`: `X.Y.Z`, `X.Y`, `latest`.
  - Permisos del workflow: `contents: read`, `packages: write`.

## 5. README (profesional, inglés)

- Foto personal centrada arriba:
  `https://personal-assets-smv.s3.us-east-2.amazonaws.com/myself-img_3.jpg`
  (reemplaza el logo S3 actual).
- Badges: Next.js, TypeScript, Docker, License.
- **Live Demo → https://www.sebastianmv.dev/**
- Secciones: Overview, Tech Stack, Features, Getting Started (pnpm),
  Running with Docker, Pulling from GHCR, Environment Variables (tabla),
  Project Structure.

## Verificación (antes de declarar terminado)

- `pnpm install` genera lockfile sin errores.
- `pnpm lint` y `pnpm build` pasan localmente.
- `docker build` completa exitosamente.
- `docker run` levanta el contenedor y responde en el puerto 3000.

## Notas

- `.env.development` / `.env.production` están gitignored: se editan localmente
  para no romper el desarrollo, pero no se commitean. Solo `.env.template` se commitea.
- Node 22 LTS se fija en la imagen y en `engines` (local tiene Node 25, demasiado
  nuevo para una imagen estable).
