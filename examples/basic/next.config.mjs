import withSwingset from 'swingset'
import remarkGfm from 'remark-gfm'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'

export default withSwingset({
  componentRootPattern: './components',
  theme: 'swingset-theme-hashicorp',
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeMdxCodeProps],
})({
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@hashicorp/flight-icons'],
})
