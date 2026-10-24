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

# tini runs as PID 1 so SIGTERM (docker stop, Dokploy redeploys) reaches node and stops it promptly.
RUN apk add --no-cache tini \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs astro

# Secrets (EMAIL_*, REDIS_URL) are NOT part of the image: pass them at runtime (`--env-file`, Dokploy).
COPY --from=prod-deps --chown=astro:nodejs /app/node_modules ./node_modules
# dist/client: prerendered pages + assets; dist/server: the standalone Node server (API route).
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --chown=astro:nodejs package.json ./

USER astro

EXPOSE 3000

# The prerendered home page is served by the same Node process, so a 200 means the server is up.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:3000/ || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "./dist/server/entry.mjs"]
