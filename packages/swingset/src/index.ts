import type { NextConfig } from 'next'
import { MARKDOWN_EXTENSION_REGEX } from './constants'
import { applyConfigDefaults, SwingsetConfig } from './config'

const DEFAULT_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']

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
                componentRoot: resolvedConfig.componentRoot,
                docsRoot: resolvedConfig.docsRoot,
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
