/** The Redis commands the limiter needs; ioredis satisfies it, tests pass an in-memory double. */
export interface RateLimitStore {
  get(key: string): Promise<string | null>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
  ttl(key: string): Promise<number>;
}

export type RateLimitStatus = { readonly allowed: true } | { readonly allowed: false; readonly hoursRemaining: number };

export interface RateLimiter {
  check(clientId: string): Promise<RateLimitStatus>;
  /** Counts one attempt; called only after a message was actually sent. */
  record(clientId: string): Promise<void>;
}

export interface RateLimitOptions {
  readonly limit: number;
  readonly windowSeconds: number;
}

const DEFAULTS: RateLimitOptions = { limit: 3, windowSeconds: 24 * 60 * 60 };

/**
 * Fixed-window limiter (3 messages per IP per 24h by default). The store is resolved on every
 * call so a missing or unreachable Redis surfaces as a rejected promise the caller can handle.
 */
export function createRedisRateLimiter(
  getStore: () => RateLimitStore,
  { limit, windowSeconds }: RateLimitOptions = DEFAULTS,
): RateLimiter {
  // Same key as the v2 portfolio so both share one counter on the shared Redis.
  const keyOf = (clientId: string) => `contact_attempts:${clientId}`;

  return {
    async check(clientId) {
      const store = getStore();
      const key = keyOf(clientId);
      const attempts = Number.parseInt((await store.get(key)) ?? '0', 10) || 0;
      if (attempts < limit) return { allowed: true };

      let ttl = await store.ttl(key);
      if (ttl < 0) {
        // An INCR whose EXPIRE never landed would block forever; restore the window.
        await store.expire(key, windowSeconds);
        ttl = windowSeconds;
      }
      return { allowed: false, hoursRemaining: Math.max(1, Math.ceil(ttl / 3600)) };
    },

    async record(clientId) {
      const store = getStore();
      const key = keyOf(clientId);
      if ((await store.incr(key)) === 1) await store.expire(key, windowSeconds);
    },
  };
}
