import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reports: ['text', 'lcov'],
      exclude: ['node_modules/', 'dist/', 'src/**/*.test.tsx'],
    },
  },
});