import fs from 'fs'
import { LOGS } from '../logs'
import { Bootstrap } from '../types'
import { convertNextConfig } from '../convert-next-config'

/*
This command generates the following file structure, 
Is supporting this old next versions aka page directory necessary? 

app/
(swingset)
  ├ /layout.tsx
  └ /swingset
    ├ /page.tsx 
    └ /[...path]
      └ /page.tsx
*/

const bootstrap: Bootstrap = {
  name: 'bootstrap',
  description: 'Creates a swingset template in the `app` or `pages` directory',
  builder: {},
  handler: (_) => {
    const appDir = './app'
    const hasAppDir = fs.existsSync(appDir)

    console.log('Getting you started with Swingset...')
    if (!hasAppDir) {
      fs.mkdirSync(appDir)
    }

    const swingsetRouteGroupDir = `${appDir}/(swingset)`
    const hasSwingset = fs.existsSync(swingsetRouteGroupDir)

    if (hasSwingset) {
      LOGS.bootstrap.hasSwingset()
      return
    }
    fs.mkdirSync(swingsetRouteGroupDir)
    const layoutTSXFile = `${swingsetRouteGroupDir}/layout.tsx`
    const layoutContent = `import layout from 'swingset/theme'\n\nexport default layout`

    fs.writeFileSync(layoutTSXFile, layoutContent, { encoding: 'utf-8' })

    const swingsetDir = `${swingsetRouteGroupDir}/swingset`
    fs.mkdirSync(swingsetDir)
    const pageTSXFile = `${swingsetDir}/page.tsx`
    const pageContent = `import Content from './content.mdx'\n\nexport default async function SwingsetRoot() {\n return <Content />\n}`
    fs.writeFileSync(pageTSXFile, pageContent, { encoding: 'utf-8' })

    const dynamicPathDir = `${swingsetDir}/[...path]`
    fs.mkdirSync(dynamicPathDir)
    const dyanamicPageTSXFile = `${dynamicPathDir}/page.tsx`
    const dyanamicPageContent = `import { generateStaticParams } from 'swingset/meta'\nimport { Page } from 'swingset/theme'\n\nexport default Page\nexport { generateStaticParams }`
    fs.writeFileSync(dyanamicPageTSXFile, dyanamicPageContent, {
      encoding: 'utf-8',
    })

    const nextConfigPath = `${appDir}/next.config.js`
    const hasNextConfig = fs.existsSync(nextConfigPath)
    if (!hasNextConfig) {
      fs.writeFileSync(
        nextConfigPath,
        `import withSwingset from 'swingset'
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
`
      )
    } else {
      const nextConfigContents = fs.readFileSync(nextConfigPath, {
        encoding: 'ascii',
      })
      /**
       * //TODO: Build logic to add swingset without editing their current config
       */
      console.log(convertNextConfig(nextConfigContents) && 'Next config found')
    }

    LOGS.bootstrap.bootstrapComplete()
  },
}

export { bootstrap }
