const withTM = require('next-transpile-modules')
const withSwingset = require('swingset')
const withBundleAnalyzer = require('@next/bundle-analyzer')

module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(withTM(['swingset'])(withSwingset()()))
