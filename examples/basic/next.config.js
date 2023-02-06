/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const withTM = require('next-transpile-modules')
const withSwingset = require('swingset')
const withBundleAnalyzer = require('@next/bundle-analyzer')

module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(withTM(['swingset'])(withSwingset()()))
