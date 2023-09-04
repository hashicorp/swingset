module.exports = {
  root: true,
  extends: require.resolve('@hashicorp/platform-cli/config/.eslintrc.js'),
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
  /* Specify overrides here */
}
