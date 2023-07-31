/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { detect, PM } from 'detect-package-manager'
import { error, Logs } from './logs'

export async function getPkgInstallCmd() {
  let pkg: PM = 'npm'
  try {
    pkg = await detect()
  } catch (err) {
    Logs.bootstrap.unableToInstall()
    console.log(error(err as string))
    process.exit(1)
  }
  const installSwingsetCMD =
    pkg === 'yarn' ? `${pkg} add swingset` : `${pkg} install swingset`

  return installSwingsetCMD
}
