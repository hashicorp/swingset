import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'swingset',
    entry: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
    format: 'esm',
    dts: true,
    bundle: true,
    splitting: false,
    external: ['swingset'],
    target: 'es2020',
  },
  {
    name: 'swingset-decl',
    entry: ['src/**/*.d.ts', 'src/**/*.js'],
    format: 'esm',
    loader: {
      '.d.ts': 'copy',
    },
  },
])
