export const FILES = {
  content: {
    layout: "import layout from 'swingset/theme'\n\nexport default layout",
    nextConfig: `import withSwingset from 'swingset'
export default withSwingset({
  componentRootPattern: './components',
  theme: 'swingset-theme-hashicorp',
})`,
    swingset: {
      page: "import Content from './content.mdx'\n\nexport default async function SwingsetRoot() {\n return <Content />\n}",
      dyanamicPage: `import { generateStaticParams } from 'swingset/meta'\nimport { Page } from 'swingset/theme'\n\nexport default Page\nexport { generateStaticParams }`,
    },
  },
  paths: {
    appDir: './app',
    nextConfig: './app/next.config.js',
    routeGroupDir: './app/(swingset)',
    layout: './app/(swingset)/layout.tsx',
    swingsetDir: './app/(swingset)/swingset',
    page: './app/(swingset)/swingset/page.tsx',
    dynamicDir: './app/(swingset)/swingset/[...page]',
    dynamicPage: './app/(swingset)/swingset/[...page]/page.tsx',
  },
} as const
