import { RELEASE_SCRIPT, RESERVE_SCRIPT, type RateLimitStore } from './rate-limiter';

/**
 * In-memory stand-in for Redis that evaluates the limiter's two Lua scripts. Each call runs to
 * completion without awaiting, so, like Redis, a script is atomic with respect to the others.
 */
export function fakeRateLimitStore() {
  const values = new Map<string, number>();
  const ttls = new Map<string, number>();
  const expireCalls: Array<[string, number]> = [];

  const store: RateLimitStore = {
    async eval(script, _numKeys, key, ...args) {
      const name = String(key);
      if (script === RESERVE_SCRIPT) {
        const window = Number(args[0]);
        const count = (values.get(name) ?? 0) + 1;
        values.set(name, count);
        let ttl = ttls.get(name) ?? -1;
        if (count === 1 || ttl < 0) {
          expireCalls.push([name, window]);
          ttls.set(name, window);
          ttl = window;
        }
        return [count, ttl];
      }
      if (script === RELEASE_SCRIPT) {
        const current = values.get(name) ?? 0;
        if (current <= 0) return 0;
        values.set(name, current - 1);
        return current - 1;
      }
      throw new Error('Unknown script');
    },
  };
  return { store, values, ttls, expireCalls };
}
