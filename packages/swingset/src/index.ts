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
            },
          ],
        })

        config.module.rules.push({
          test: /swingset\/__component-data/,
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

        return config
      },
    } as NextConfig
  }
}
