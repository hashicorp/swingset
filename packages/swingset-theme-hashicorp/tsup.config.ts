import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'swingset-theme-hashicorp',
    entry: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
    format: 'esm',
    dts: true,
    bundle: false,
    splitting: false,
    external: ['swingset'],
    target: 'es2020',
  },
])
