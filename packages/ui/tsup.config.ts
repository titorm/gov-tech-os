import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/lib/utils.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
})