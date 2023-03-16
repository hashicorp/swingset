import type { NextConfig } from 'next'
import {
  MARKDOWN_EXTENSION_REGEX,
  NEXT_MDX_COMPONENTS_ALIAS,
} from './constants'
import { applyConfigDefaults, SwingsetConfig } from './config'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']

// c.f. https://github.com/vercel/next.js/blob/canary/packages/next-mdx/index.js
function addNextMdxImportAlias(config: any) {
  config.resolve.alias[NEXT_MDX_COMPONENTS_ALIAS] ||= [
    'private-next-root-dir/src/mdx-components',
    'private-next-root-dir/mdx-components',
    '@mdx-js/react',
  ]
}

export default function swingset(swingsetConfig: Partial<SwingsetConfig>) {
  return function withSwingset(
    nextConfig: Partial<NextConfig> = {}
  ): NextConfig {
    const resolvedConfig = applyConfigDefaults(swingsetConfig)

    return {
      ...nextConfig,
      pageExtensions: [
        ...(nextConfig.pageExtensions ?? DEFAULT_EXTENSIONS),
        'mdx',
      ],
      webpack(config, options) {
        // Allow re-use of the pattern for defining component overrides provided by @next/mdx
        addNextMdxImportAlias(config)

        config.module.rules.push({
          test: MARKDOWN_EXTENSION_REGEX,
          issuer: (request: string | null) =>
            Boolean(request) || request === null,
          use: [
            options.defaultLoaders.babel,
            {
              loader: 'swingset/loader',
              options: {
                isContentImport: true,
                ...resolvedConfig,
              },
            },
          ],
        })

        config.module.rules.push({
          test: /swingset\/(dist\/)?meta/,
          use: [
            options.defaultLoaders.babel,
            {
              loader: 'swingset/loader',
              options: {
                isMetaImport: true,
                ...resolvedConfig,
              },
            },
          ],
        })

        config.module.rules.push({
          test: /swingset\/(dist\/)?theme/,
          use: [
            options.defaultLoaders.babel,
            {
              loader: 'swingset/loader',
              options: {
                isThemeImport: true,
                ...resolvedConfig,
              },
            },
          ],
        })

        return config
      },
    } as NextConfig
  }
}
