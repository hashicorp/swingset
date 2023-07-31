/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import withSwingset from 'swingset'
import remarkGfm from 'remark-gfm'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'

export default withSwingset({
  componentRootPattern: './components',
  theme: 'swingset-theme-hashicorp',
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeMdxCodeProps],
})({
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@hashicorp/flight-icons'],
})
