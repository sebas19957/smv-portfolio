import { defineConfig } from 'vitest/config';

// The tested modules are plain TypeScript (no `astro:*` virtual modules), so Astro's Vite config
// is not needed here. DOM tests opt into happy-dom per file with `@vitest-environment`.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    restoreMocks: true,
  },
});
