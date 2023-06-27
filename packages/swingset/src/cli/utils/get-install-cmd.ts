import { detect, PM } from 'detect-package-manager'
import { error, Logs } from './logs'

export async function getInstallCMD() {
  let pkg: PM = 'npm'
  try {
    pkg = await detect()
  } catch (err) {
    Logs.bootstrap.unableToInstall()
    error(err as string)
    process.exit(1)
  }
  const installSwingsetCMD =
    pkg === 'yarn' ? `${pkg} add swingset` : `${pkg} install swingset`

  return installSwingsetCMD
}
