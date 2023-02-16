import withSwingset from 'swingset'

export default withSwingset({
  componentRootPattern: './components',
})({
  experimental: {
    appDir: true,
  },
})
