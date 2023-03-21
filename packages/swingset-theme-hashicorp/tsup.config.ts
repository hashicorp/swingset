import { defineConfig } from 'tsup'
import { Buffer } from 'node:buffer'

/**
 * Ensure that the "use client"; directive for RSC is always at the top of the output file even after the build is finished.
 */
const UseClientDirectivePlugin = {
  name: 'use-client-directive',
  setup(build) {
    const DIRECTIVE_STRING = `"use client";`

    build.onEnd((result) => {
      // no errors, add directives
      if (result.errors.length === 0) {
        for (const file of result.outputFiles) {
          if (/"use client";/.test(file.text)) {
            const buf = Buffer.from(file.contents)
            const directiveIndex = buf.indexOf(DIRECTIVE_STRING)

            // splice the original directive out of the contents buffer, concat the directive at the top of the file so it doesn't cause errors
            file.contents = Buffer.concat([
              Buffer.from(`"use client";\n`),
              buf.subarray(0, directiveIndex),
              buf.subarray(directiveIndex + DIRECTIVE_STRING.length),
            ])
          }
        }
      }
    })
  },
}

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
    esbuildPlugins: [UseClientDirectivePlugin],
  },
])
