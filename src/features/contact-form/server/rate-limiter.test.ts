import { describe, expect, it } from 'vitest';
import { createRedisRateLimiter, type RateLimitStore } from './rate-limiter';

/** In-memory stand-in for the four Redis commands the limiter uses. */
function fakeStore() {
  const values = new Map<string, number>();
  const ttls = new Map<string, number>();
  const expireCalls: Array<[string, number]> = [];
  const store: RateLimitStore = {
    get: async (key) => (values.has(key) ? String(values.get(key)) : null),
    incr: async (key) => {
      const next = (values.get(key) ?? 0) + 1;
      values.set(key, next);
      return next;
    },
    expire: async (key, seconds) => {
      expireCalls.push([key, seconds]);
      ttls.set(key, seconds);
      return 1;
    },
    ttl: async (key) => (values.has(key) ? (ttls.get(key) ?? -1) : -2),
  };
  return { store, values, ttls, expireCalls };
}

const DAY = 24 * 60 * 60;

describe('createRedisRateLimiter', () => {
  it('allows an IP with no recorded attempts', async () => {
    const { store } = fakeStore();
    const limiter = createRedisRateLimiter(() => store);
    await expect(limiter.check('203.0.113.7')).resolves.toEqual({ allowed: true });
  });

  it('counts attempts per IP and sets the 24h window only on the first increment', async () => {
    const { store, values, expireCalls } = fakeStore();
    const limiter = createRedisRateLimiter(() => store);
    await limiter.record('203.0.113.7');
    await limiter.record('203.0.113.7');
    expect(values.get('contact_attempts:203.0.113.7')).toBe(2);
    expect(expireCalls).toEqual([['contact_attempts:203.0.113.7', DAY]]);
  });

  it('blocks after 3 attempts and reports the hours left, rounded up', async () => {
    const { store, ttls } = fakeStore();
    const limiter = createRedisRateLimiter(() => store);
    for (let i = 0; i < 3; i++) await limiter.record('203.0.113.7');
    ttls.set('contact_attempts:203.0.113.7', 2 * 3600 + 1);
    await expect(limiter.check('203.0.113.7')).resolves.toEqual({ allowed: false, hoursRemaining: 3 });
    await expect(limiter.check('198.51.100.1')).resolves.toEqual({ allowed: true });
  });

  it('never reports less than one hour', async () => {
    const { store, values, ttls } = fakeStore();
    values.set('contact_attempts:ip', 3);
    ttls.set('contact_attempts:ip', 5);
    const limiter = createRedisRateLimiter(() => store);
    await expect(limiter.check('ip')).resolves.toEqual({ allowed: false, hoursRemaining: 1 });
  });

  it('restores the window when a blocked key lost its expiry, so it cannot block forever', async () => {
    const { store, values, expireCalls } = fakeStore();
    values.set('contact_attempts:ip', 3);
    const limiter = createRedisRateLimiter(() => store);
    await expect(limiter.check('ip')).resolves.toEqual({ allowed: false, hoursRemaining: 24 });
    expect(expireCalls).toEqual([['contact_attempts:ip', DAY]]);
  });

  it('honours custom limits', async () => {
    const { store } = fakeStore();
    const limiter = createRedisRateLimiter(() => store, { limit: 1, windowSeconds: 3600 });
    await limiter.record('ip');
    await expect(limiter.check('ip')).resolves.toEqual({ allowed: false, hoursRemaining: 1 });
  });

  it('resolves the store lazily and surfaces its errors to the caller', async () => {
    const limiter = createRedisRateLimiter(() => {
      throw new Error('REDIS_URL is not set');
    });
    await expect(limiter.check('ip')).rejects.toThrow('REDIS_URL is not set');
  });
});
