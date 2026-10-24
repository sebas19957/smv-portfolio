# syntax=docker/dockerfile:1

# Exact Node version: package.json engines require >= 22.23.4.
ARG NODE_VERSION=22.23.4

# ---- Base ----
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ---- Dependencies (all, for the build) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---- Production dependencies (runtime only) ----
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---- Runner ----
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs astro

# Secrets (EMAIL_*, REDIS_URL) are NOT part of the image: pass them at runtime (`--env-file`, Dokploy).
COPY --from=prod-deps --chown=astro:nodejs /app/node_modules ./node_modules
# dist/client: prerendered pages + assets; dist/server: the standalone Node server (API route).
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --chown=astro:nodejs package.json ./

USER astro

EXPOSE 3000

CMD ["node", "./dist/server/entry.mjs"]
