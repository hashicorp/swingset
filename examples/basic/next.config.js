/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
*/

const path = require('path')
const withTM = require('next-transpile-modules')
const withSwingset = require('swingset')
const withBundleAnalyzer = require('@next/bundle-analyzer')

module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(
  withTM(['swingset'])(
    withSwingset()({
      webpack(config) {
        config.cache.buildDependencies.yalc = [
          path.join(__dirname, 'yalc.lock'),
        ]

        return config
      },
    })
  )
)
