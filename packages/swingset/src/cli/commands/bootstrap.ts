import fs from 'fs'
import { Logs, codeText } from '../utils/logs'
import { Bootstrap } from '../types'
import childProcess from 'child_process'
import { getPkgInstallCmd } from '../utils/get-pkg-install-cmd'
import { FILES } from '../utils/constants'

/*
This command generates the following file structure, 
Is supporting this old next versions aka page directory necessary? 
app/
(swingset)
  ├ /layout.tsx
  └ /swingset
    ├ page.tsx 
    └ /[...path]
      └ page.tsx
  next.config.js
*/

const bootstrap: Bootstrap = {
  name: 'bootstrap',
  description: 'Creates a swingset template in the `app` directory',
  builder: {},
  handler: async () => {
    Logs.bootstrap.start()

    const installSwingset = await getPkgInstallCmd()
    console.log('Running', codeText(installSwingset))
    childProcess.execSync(installSwingset, { stdio: 'inherit' })

    /**
     * Attempt to Create:
     * app/(swingset)/
     * If ./app exists, will ignore
     * if ./app/(swingset) exists, log error and exit 1
     */

    const hasSwingset = fs.existsSync(FILES.paths.routeGroupDir)

    if (hasSwingset) {
      Logs.bootstrap.hasSwingset()
      process.exit(1)
    }

    fs.mkdirSync(FILES.paths.routeGroupDir, { recursive: true })
    fs.writeFileSync(FILES.paths.layout, FILES.content.layout, {
      encoding: 'utf-8',
    })

    /**
     * Create:
     * app/(swingset)/swingset/page.tsx/
     * &&
     * app/(swingset)/swingset/page/[...page]/page.tsx
     */

    fs.mkdirSync(FILES.paths.dynamicDir, { recursive: true })
    fs.writeFileSync(FILES.paths.page, FILES.content.swingset.page, {
      encoding: 'utf-8',
    })

    /**
     * Create:
     * app/(swingset)/swingset/page/[...page]/page.tsx
     */

    fs.writeFileSync(
      FILES.paths.dynamicPage,
      FILES.content.swingset.dyanamicPage,
      {
        encoding: 'utf-8',
      }
    )

    /**
     * If user has nextconfig already, exit and point them to docs,
     * if not, create next config with swingset
     */

    const hasNextConfig = fs.existsSync(FILES.paths.nextConfig)
    if (!hasNextConfig) {
      fs.writeFileSync(FILES.paths.nextConfig, FILES.content.nextConfig)
      Logs.bootstrap.complete()
      process.exit(0)
    } else {
      Logs.bootstrap.completeNoConfig()
      process.exit(0)
    }
  },
}

export { bootstrap }
