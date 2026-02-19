import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts', './src/__tests__/vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/__mocks__/**',
      ],
    },
    server: {
      deps: {
        inline: [
          'nostr-crypto-utils',
          'nostr-websocket-utils',
        ],
      },
    },
  },
});
