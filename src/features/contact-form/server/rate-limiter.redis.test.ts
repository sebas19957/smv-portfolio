import Redis from 'ioredis';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createRedisRateLimiter } from './rate-limiter';

/*
 * Runs the real Lua scripts against a disposable Redis; skipped unless REDIS_TEST_URL is set
 * (e.g. `docker run --rm -p 6390:6379 redis:7-alpine` + REDIS_TEST_URL=redis://localhost:6390).
 * Never point it at the shared production Redis: it writes and deletes keys.
 */
const url = process.env.REDIS_TEST_URL;

describe.skipIf(!url)('createRedisRateLimiter on a real Redis', () => {
  const redis = new Redis(url ?? '', { lazyConnect: true });
  const limiter = createRedisRateLimiter(() => redis);
  const ip = `test-${process.pid}`;
  const key = `contact_attempts:${ip}`;

  beforeEach(async () => {
    await redis.del(key);
  });

  afterAll(async () => {
    await redis.del(key);
    redis.disconnect();
  });

  it('lets concurrent reservations through only up to the limit, with a 24h window', async () => {
    const results = await Promise.all(Array.from({ length: 10 }, () => limiter.reserve(ip)));
    expect(results.filter((result) => result.allowed)).toHaveLength(3);
    expect(results.find((result) => !result.allowed)).toEqual({ allowed: false, hoursRemaining: 24 });
    // Integer value, readable by the v2 app's GET.
    expect(await redis.get(key)).toBe('10');
    expect(await redis.ttl(key)).toBeGreaterThan(24 * 3600 - 5);
  });

  it('re-arms the window on a key that lost its expiry', async () => {
    await redis.set(key, '3');
    await expect(limiter.reserve(ip)).resolves.toEqual({ allowed: false, hoursRemaining: 24 });
    expect(await redis.ttl(key)).toBeGreaterThan(0);
  });

  it('releases without dropping below zero or losing the expiry', async () => {
    await limiter.reserve(ip);
    await limiter.release(ip);
    await limiter.release(ip);
    expect(await redis.get(key)).toBe('0');
    expect(await redis.ttl(key)).toBeGreaterThan(0);

    await redis.del(key);
    await limiter.release(ip);
    expect(await redis.exists(key)).toBe(0);
  });
});
