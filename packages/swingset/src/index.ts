import type { NextConfig } from 'next'

interface SwingsetConfig {
  componentRootPattern: string
}

const MARKDOWN_EXTENSION_REGEX = /\.mdx?$/

export default function swingset(swingsetConfig: SwingsetConfig) {
  return function withSwingset(
    nextConfig: Partial<NextConfig> = {}
  ): NextConfig {
    return {
      ...nextConfig,
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
