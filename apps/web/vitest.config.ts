import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@repo/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@repo/types': path.resolve(__dirname, '../../packages/types/src'),
      '@repo/utils': path.resolve(__dirname, '../../packages/utils/src'),
    },
  },
})