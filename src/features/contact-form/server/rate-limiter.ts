import { RATE_LIMIT } from '../contact-message';

/** The one Redis command the limiter needs (EVAL); ioredis satisfies it, tests pass an in-memory double. */
export interface RateLimitStore {
  eval(script: string, numKeys: number, ...args: Array<string | number>): Promise<unknown>;
}

export type RateLimitStatus = { readonly allowed: true } | { readonly allowed: false; readonly hoursRemaining: number };

export interface RateLimiter {
  /** Atomically counts one attempt before sending; rejected once the client is over the limit. */
  reserve(clientId: string): Promise<RateLimitStatus>;
  /** Gives back the attempt of a message that could not be sent. */
  release(clientId: string): Promise<void>;
}

export interface RateLimitOptions {
  readonly limit: number;
  readonly windowSeconds: number;
}

const DEFAULTS: RateLimitOptions = { limit: RATE_LIMIT.messages, windowSeconds: RATE_LIMIT.windowHours * 60 * 60 };

/**
 * KEYS[1] counter, ARGV[1] window in seconds; returns `{count, ttl}`. The window starts on the
 * first attempt and is re-armed when the key has no expiry (an INCR from another client whose
 * EXPIRE never landed would otherwise block forever).
 */
export const RESERVE_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
local ttl = redis.call('TTL', KEYS[1])
if count == 1 or ttl < 0 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
  ttl = tonumber(ARGV[1])
end
return {count, ttl}
`;

/** KEYS[1] counter; decrements it without going below zero (DECR keeps the TTL). */
export const RELEASE_SCRIPT = `
local count = tonumber(redis.call('GET', KEYS[1]))
if count and count > 0 then
  return redis.call('DECR', KEYS[1])
end
return 0
`;

/**
 * Fixed-window limiter (3 messages per IP per 24h by default). Each attempt is reserved with one
 * atomic script before sending, so concurrent requests cannot slip past the limit. The store is
 * resolved on every call so a missing or unreachable Redis surfaces as a rejected promise the
 * caller can handle.
 */
export function createRedisRateLimiter(
  getStore: () => RateLimitStore,
  { limit, windowSeconds }: RateLimitOptions = DEFAULTS,
): RateLimiter {
  // Same key and integer value as the v2 portfolio, so both share one counter on the shared Redis.
  const keyOf = (clientId: string) => `contact_attempts:${clientId}`;

  return {
    async reserve(clientId) {
      const [count, ttl] = (await getStore().eval(RESERVE_SCRIPT, 1, keyOf(clientId), windowSeconds)) as [
        number,
        number,
      ];
      if (count <= limit) return { allowed: true };
      return { allowed: false, hoursRemaining: Math.max(1, Math.ceil(ttl / 3600)) };
    },

    async release(clientId) {
      await getStore().eval(RELEASE_SCRIPT, 1, keyOf(clientId));
    },
  };
}
