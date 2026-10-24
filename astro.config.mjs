// @ts-check
import node from '@astrojs/node';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.sebastianmv.dev',
  // Static by default; only `/api/send-email` opts out of prerendering and runs on the Node server.
  adapter: node({ mode: 'standalone' }),
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  env: {
    // Server-only secrets, read from the environment at runtime (never inlined into the build).
    // All strings: empty values from env files (`KEY=`) must not fail validation; the contact
    // feature applies the fallbacks (see `smtp-config.ts`).
    schema: {
      EMAIL_HOST: envField.string({ context: 'server', access: 'secret', default: 'smtp.gmail.com' }),
      EMAIL_PORT: envField.string({ context: 'server', access: 'secret', default: '587' }),
      EMAIL_USER: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMAIL_PASS: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMAIL_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
      EMAIL_RECEIVER: envField.string({ context: 'server', access: 'secret', optional: true }),
      REDIS_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
