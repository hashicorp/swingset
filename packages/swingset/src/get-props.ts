import path from 'node:path'
import fs from 'node:fs'

import { parse } from 'react-docgen'

/**
 * Extracts prop information from a component file.
 */
export async function getRelatedComponentPropsMetadata({
  directory,
  filepath,
  source,
}: {
  directory: string
  filepath?: string
  source?: string
}) {
  if (source) {
    return parse(source, { filename: filepath })
  }

  // TODO: support additional extensions
  const componentSourcePath = path.resolve(directory, './index.tsx')

  if (fs.existsSync(componentSourcePath)) {
    const componentSource = await fs.promises.readFile(
      componentSourcePath,
      'utf-8'
    )
    const propsMeta = parse(componentSource, { filename: componentSourcePath })

    return propsMeta
  }

  return []
}
