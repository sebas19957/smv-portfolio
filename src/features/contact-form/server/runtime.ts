import {
  EMAIL_FROM,
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_PORT,
  EMAIL_RECEIVER,
  EMAIL_USER,
  REDIS_URL,
} from 'astro:env/server';
import Redis from 'ioredis';
import { createSmtpMailer } from './mailer';
import { createRedisRateLimiter } from './rate-limiter';
import type { SendContactDeps } from './send-contact-message';
import { readSmtpConfig } from './smtp-config';

/*
 * Composition root for the contact API. Secrets come from `astro:env/server`, which the Node
 * adapter reads from `process.env` at runtime: nothing is inlined at build time or baked into the
 * image. They are declared optional so a missing value fails the request (logged), not the import.
 */

let redis: Redis | null = null;

/** Lazy ioredis client: created on the first rate-limit call, so builds never need REDIS_URL. */
function getRedis(): Redis {
  if (redis) return redis;
  if (!REDIS_URL) throw new Error('Missing environment variable: REDIS_URL');
  // Short timeouts keep the fail-open path fast when Redis is unreachable.
  redis = new Redis(REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1, connectTimeout: 2000, commandTimeout: 2000 });
  // ioredis keeps reconnecting in the background; log at most once a minute while it is down.
  let lastLog = 0;
  redis.on('error', (error) => {
    if (Date.now() - lastLog < 60_000) return;
    lastLog = Date.now();
    console.error('[contact] redis connection error', error);
  });
  return redis;
}

export const contactDeps: SendContactDeps = {
  mailer: createSmtpMailer(() =>
    readSmtpConfig({ EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, EMAIL_RECEIVER }),
  ),
  limiter: createRedisRateLimiter(getRedis),
  logger: console,
};
