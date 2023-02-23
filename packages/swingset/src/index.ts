import type { NextConfig } from 'next'
import { MARKDOWN_EXTENSION_REGEX } from './constants'

interface SwingsetConfig {
  componentRootPattern: string
  docsRoot?: string
}

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']

export default function swingset(swingsetConfig: SwingsetConfig) {
  return function withSwingset(
    nextConfig: Partial<NextConfig> = {}
  ): NextConfig {
    return {
      ...nextConfig,
      pageExtensions: [
        ...(nextConfig.pageExtensions ?? DEFAULT_EXTENSIONS),
        'mdx',
      ],
      webpack(config, options) {
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
                componentRootPattern: swingsetConfig.componentRootPattern,
                docsRoot: swingsetConfig.docsRoot,
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
                theme: 'swingset/default-theme',
              },
            },
          ],
        })

        return config
      },
    } as NextConfig
  }
}
