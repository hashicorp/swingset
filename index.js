/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const path = require('path')

/**
 *
 * @param {import('./types').PluginOptions} pluginOptions
 * @returns
 */
function withSwingset(pluginOptions = {}) {
  /**
   * @param {import('next/types').NextConfig} nextConfig
   */
  return function nextOverrides(nextConfig = {}) {
    return Object.assign({}, nextConfig, {
      /**
       *
       * @param {*} config
       * @param {import('next/dist/server/config-shared').WebpackConfigContext} options
       * @returns
       */
      webpack(config, options) {
        // normalize componentsRoot path
        pluginOptions.componentsRoot = path.resolve(
          config.context,
          pluginOptions.componentsRoot
            ? pluginOptions.componentsRoot
            : 'components/*'
        )
        // normalize docsRoot path
        pluginOptions.docsRoot = path.resolve(
          config.context,
          pluginOptions.docsRoot ? pluginOptions.docsRoot : 'docs/*'
        )
        //
        config.module.rules.push({
          test: /__swingset_data/,
          use: [
            {
              loader: path.join(__dirname, 'components-loader.js'),
              options: { pluginOptions, webpackConfig: config },
            },
          ],
        })

        // Don't clobber previous plugins' webpack functions
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    })
  }
}

module.exports = withSwingset
