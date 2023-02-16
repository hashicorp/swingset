import { defineConfig, Options } from 'tsup'

import tsconfig from './tsconfig.json'

const { target } = tsconfig.compilerOptions

export default defineConfig([
  {
    name: 'swingset',
    entry: ['src/**/*.ts', 'src/**/*.tsx', '!src/**/*.d.ts'],
    format: 'esm',
    dts: true,
    bundle: true,
    target: 'es2020',
  },
])
