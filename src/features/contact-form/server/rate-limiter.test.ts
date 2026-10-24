import { describe, expect, it } from 'vitest';
import { fakeRateLimitStore } from './fake-rate-limit-store';
import { createRedisRateLimiter } from './rate-limiter';

const DAY = 24 * 60 * 60;
const KEY = 'contact_attempts:203.0.113.7';

describe('createRedisRateLimiter', () => {
  it('allows the first 3 reservations of an IP and rejects the next with the hours left, rounded up', async () => {
    const { store, values, ttls } = fakeRateLimitStore();
    const limiter = createRedisRateLimiter(() => store);
    for (let i = 0; i < 3; i++) await expect(limiter.reserve('203.0.113.7')).resolves.toEqual({ allowed: true });
    expect(values.get(KEY)).toBe(3);

    ttls.set(KEY, 2 * 3600 + 1);
    await expect(limiter.reserve('203.0.113.7')).resolves.toEqual({ allowed: false, hoursRemaining: 3 });
    await expect(limiter.reserve('198.51.100.1')).resolves.toEqual({ allowed: true });
  });

  it('sets the 24h window only on the first reservation', async () => {
    const { store, expireCalls } = fakeRateLimitStore();
    const limiter = createRedisRateLimiter(() => store);
    await limiter.reserve('203.0.113.7');
    await limiter.reserve('203.0.113.7');
    expect(expireCalls).toEqual([[KEY, DAY]]);
  });

  it('never reports less than one hour', async () => {
    const { store, values, ttls } = fakeRateLimitStore();
    values.set('contact_attempts:ip', 3);
    ttls.set('contact_attempts:ip', 5);
    const limiter = createRedisRateLimiter(() => store);
    await expect(limiter.reserve('ip')).resolves.toEqual({ allowed: false, hoursRemaining: 1 });
  });

  it('restores the window when a key lost its expiry, so it cannot block forever', async () => {
    const { store, values, expireCalls } = fakeRateLimitStore();
    values.set('contact_attempts:ip', 3);
    const limiter = createRedisRateLimiter(() => store);
    await expect(limiter.reserve('ip')).resolves.toEqual({ allowed: false, hoursRemaining: 24 });
    expect(expireCalls).toEqual([['contact_attempts:ip', DAY]]);
  });

  it('lets concurrent requests from one IP through only up to the limit', async () => {
    const { store, values } = fakeRateLimitStore();
    const limiter = createRedisRateLimiter(() => store);
    const results = await Promise.all(Array.from({ length: 10 }, () => limiter.reserve('203.0.113.7')));
    expect(results.filter((result) => result.allowed)).toHaveLength(3);
    expect(values.get(KEY)).toBe(10);
  });

  it('gives a released reservation back, never going below zero', async () => {
    const { store, values } = fakeRateLimitStore();
    const limiter = createRedisRateLimiter(() => store);
    for (let i = 0; i < 3; i++) await limiter.reserve('203.0.113.7');
    await limiter.release('203.0.113.7');
    expect(values.get(KEY)).toBe(2);
    await expect(limiter.reserve('203.0.113.7')).resolves.toEqual({ allowed: true });

    await limiter.release('198.51.100.1');
    expect(values.get('contact_attempts:198.51.100.1')).toBeUndefined();
  });

  it('honours custom limits', async () => {
    const { store } = fakeRateLimitStore();
    const limiter = createRedisRateLimiter(() => store, { limit: 1, windowSeconds: 3600 });
    await expect(limiter.reserve('ip')).resolves.toEqual({ allowed: true });
    await expect(limiter.reserve('ip')).resolves.toEqual({ allowed: false, hoursRemaining: 1 });
  });

  it('resolves the store lazily and surfaces its errors to the caller', async () => {
    const limiter = createRedisRateLimiter(() => {
      throw new Error('REDIS_URL is not set');
    });
    await expect(limiter.reserve('ip')).rejects.toThrow('REDIS_URL is not set');
    await expect(limiter.release('ip')).rejects.toThrow('REDIS_URL is not set');
  });
});
