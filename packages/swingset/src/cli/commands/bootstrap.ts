/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import { Logs, codeText } from '../utils/logs'
import childProcess from 'child_process'
import { getPkgInstallCmd } from '../utils/get-pkg-install-cmd'
import { FILES } from '../utils/constants'

/*
This command generates the following file structure
```
src/
├─ app/
│  ├─ layout.tsx
│  ├─ (swingset)/
│  │  ├─ swingset/
│  │  │  ├─ [...path]/
│  │  │  │  ├─ page.tsx
│  │  │  ├─ content.mdx
│  │  │  ├─ page.tsx
├─ next.config.js
```
May slightly vary if person isn't using src/ directory
*/

const bootstrap = {
  name: 'bootstrap',
  description: 'Creates a swingset template in the `app` directory',
  builder: {},
  handler: async () => {
    Logs.bootstrap.start()

    const installSwingset = await getPkgInstallCmd()
    console.log('Running', codeText(installSwingset))
    childProcess.execSync(installSwingset, { stdio: 'inherit' })

    /*
      Attempt to Create Swingset root: src/app/(swingset)/ OR ./app/(swingset)/
      If src/app or ./app already exist, they will be ignored
      if ./app/(swingset) exists, log error and exit 1
     */

    const hasSwingset = fs.existsSync(FILES.swingsetRoot)

    if (hasSwingset) {
      Logs.bootstrap.hasSwingset()
      process.exit(1)
    }
    fs.mkdirSync(FILES.swingsetRoot, { recursive: true })

    // Creates swingset layout: [root]/(swingset)/layout.tsx
    fs.writeFileSync(FILES.layout.path, FILES.layout.content, 'utf-8')

    /*
     * Create home page:
     * [root](swingset)/swingset/page.tsx/
     * &&
     * Dynamic route
     * [root](swingset)/swingset/[...page]/page.tsx
     */

    fs.writeFileSync(FILES.page.path, FILES.page.content, 'utf-8')
    fs.mkdirSync(FILES.dynamicPath.path)
    fs.writeFileSync(
      FILES.dynamicPath.pagePath,
      FILES.dynamicPath.pageContent,
      'utf-8'
    )

    //[root](swingset)/swingset/content.mdx
    fs.writeFileSync(FILES.content.path, FILES.content.content, 'utf-8')

    /*
     * If user has nextconfig already, exit and point them to docs,
     * if not, create next config with swingset
     */

    // TODO: explore using codemod tool to add the swingset plugin to an existing next config

    const hasNextConfig = fs.existsSync(FILES.nextConfig.path)
    if (!hasNextConfig) {
      fs.writeFileSync(FILES.nextConfig.path, FILES.nextConfig.content)
      Logs.bootstrap.complete()
    } else {
      Logs.bootstrap.completeNoConfig()
    }
  },
}

export { bootstrap }
