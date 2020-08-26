const withTM = require('next-transpile-modules')
const withOctavo = require('octavo')
const withBundleAnalyzer = require('@next/bundle-analyzer')

module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(withTM(['octavo'])(withOctavo()()))
