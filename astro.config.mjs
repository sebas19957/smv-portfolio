// @ts-check
import node from '@astrojs/node';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.sebastianmv.dev',
  // Static by default; only `/api/send-email` opts out of prerendering and runs on the Node server.
  // Request bodies over 64 KiB are cut off by the adapter (default 1 GiB); the contact API, the
  // only consumer, rejects anything over 16 KiB itself.
  adapter: node({ mode: 'standalone', bodySizeLimit: 64 * 1024 }),
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  env: {
    // Server-only secrets, read from the environment at runtime (never inlined into the build).
    // All optional strings without defaults: empty values from env files (`KEY=`) must not fail
    // validation, and `smtp-config.ts` is the single source of the SMTP fallbacks.
    schema: {
      EMAIL_HOST: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMAIL_PORT: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMAIL_USER: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMAIL_PASS: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMAIL_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMAIL_RECEIVER: envField.string({ context: 'server', access: 'secret', optional: true }),
      REDIS_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
