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
