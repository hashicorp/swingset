import withSwingset from 'swingset'

export default withSwingset({
  componentRootPattern: './components',
  theme: 'swingset-theme-hashicorp',
})({
  experimental: {
    appDir: true,
  },
})
