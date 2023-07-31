/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'

const usingSrc = fs.existsSync('./src')
const appRoot = usingSrc ? './src/app' : './app'
const routeGroupDir = `${appRoot}/(swingset)`
const swingsetRoot = `${routeGroupDir}/swingset`

export const FILES = {
  appRoot,
  routeGroupDir,
  swingsetRoot,
  nextConfig: {
    path: './next.config.js',
    content: `import withSwingset from 'swingset'

export default withSwingset({
  componentRootPattern: './components',
  theme: 'swingset-theme-hashicorp',
})`,
  },
  page: {
    path: `${swingsetRoot}/page.tsx`,
    content: `import Content from './content.mdx'

export default async function SwingsetRoot() {
  return <Content />
}`,
  },
  dynamicPath: {
    path: `${swingsetRoot}/[...path]`,
    pagePath: `${swingsetRoot}/[...path]/page.tsx`,
    pageContent: `import Content from './content.mdx'

export default async function SwingsetRoot() {
  return <Content />
}`,
  },
  layout: {
    path: `${routeGroupDir}/layout.tsx`,
    content: `import layout from 'swingset/theme'

export default layout`,
  },
  content: {
    path: `${swingsetRoot}/content.mdx`,
    content: `# Swingset!

Welcome to Swingset. Swingset is a drop-in component documentation system built for Next.js's App Router and React Server Components.

Check out our [docs](https://github.com/hashicorp/swingset#readme) to get started
`,
  },
} as const
