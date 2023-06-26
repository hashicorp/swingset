import fs from 'fs'
import { error, LOGS } from '../logs'
import { Bootstrap } from '../types'
import { detect, PM } from 'detect-package-manager'
import childProcess from 'child_process'

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
  handler: async (_) => {
    LOGS.bootstrap.start()

    let pkg: PM = 'npm'
    try {
      pkg = await detect()
    } catch (err) {
      error(err as string)
      process.exit(1)
    }
    const installSwingsetCMD =
      pkg === 'yarn' ? `${pkg} add swingset` : `${pkg} install swingset`

    childProcess.execSync(installSwingsetCMD)

    const appDir = './app'
    const hasAppDir = fs.existsSync(appDir)

    if (!hasAppDir) {
      fs.mkdirSync(appDir)
    }

    const swingsetRouteGroupDir = `${appDir}/(swingset)`
    const hasSwingset = fs.existsSync(swingsetRouteGroupDir)

    if (hasSwingset) {
      LOGS.bootstrap.hasSwingset()
      process.exit(1)
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
})({
  experimental: {
    appDir: true,
  },
})`
      )
      LOGS.bootstrap.complete()
      process.exit(0)
    } else {
      LOGS.bootstrap.completeNoConfig()
      process.exit(0)
    }
  },
}

export { bootstrap }
