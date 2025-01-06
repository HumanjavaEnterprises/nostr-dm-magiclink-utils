import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts', './src/__tests__/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        'test/**',
        'vitest.config.ts',
      ],
    },
    server: {
      deps: {
        inline: [
          'nostr-crypto-utils',
          'nostr-websocket-utils'
        ]
      }
    }
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.node'],
    preserveSymlinks: true
  }
})
