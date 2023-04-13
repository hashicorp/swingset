import withSwingset from 'swingset'
import remarkGfm from 'remark-gfm'

export default withSwingset({
  componentRootPattern: './components',
  theme: 'swingset-theme-hashicorp',
  remarkPlugins: [remarkGfm],
})({
  experimental: {
    appDir: true,
  },
})
