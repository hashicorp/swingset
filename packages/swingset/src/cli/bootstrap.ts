import yargs from 'yargs'
import fs from 'fs'
import { LOGS } from './logs'

type BootstrapCommand = {
  name: 'bootstrap'
  description: 'Creates a swingset template in the `app` or `pages` directory'
  builder: {}
  handler: (
    args: yargs.ArgumentsCamelCase<yargs.InferredOptionTypes<{}>>
  ) => void
}
/*
app/
(swingset)
  ├ /layout.tsx
  └ /swingset
    ├ /page.tsx 
    └ /[...path]
      └ /page.tsx
*/

const bootstrap: BootstrapCommand = {
  name: 'bootstrap',
  description: 'Creates a swingset template in the `app` or `pages` directory',
  builder: {},
  handler: (_) => {
    const appDir = './app'

    const hasAppDir = fs.existsSync(appDir)

    /* 
    Is supporting this old next versions worth the effort? 
    const hasPagesDir = fs.existsSync(pagesDir)
    fs.existsSync(pagesDir) 
    */
    console.log('Getting you started with Swingset...')
    if (!hasAppDir) {
      fs.mkdirSync(appDir)
    }

    const swingsetRouteGroupDir = `${appDir}/(swingset)`
    const hasSwingset = fs.existsSync(swingsetRouteGroupDir)

    if (hasSwingset) {
      LOGS.hasSwingset()
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
    const dyanamicPageContent = `import { generateStaticParams } from 'swingset/meta'\nimport { Page } from 'swingset/theme'\nexport default Page\nexport { generateStaticParams }`
    fs.writeFileSync(dyanamicPageTSXFile, dyanamicPageContent, {
      encoding: 'utf-8',
    })

    LOGS.bootstrapComplete()
  },
}

export { bootstrap }
