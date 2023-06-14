import fs from 'node:fs'
import path from 'node:path'
import readdirp from 'readdirp'
import { getFileFrontmatter } from '../get-frontmatter'
import { DocsEntity } from '../types'
import { buildLoadFunction } from './build-load-function'

interface DocResolverOptions {
  docsRoot: string
}

export async function resolveDocs({ docsRoot }: DocResolverOptions) {
  const result: DocsEntity[] = []

  for await (const f of readdirp(docsRoot, {
    fileFilter: '*.mdx',
    type: 'files',
  })) {
    const filepath = f.fullPath
    const contents = await fs.promises.readFile(filepath, 'utf-8')

    const frontmatter = getFileFrontmatter(contents)
    const relativePath = path.relative(docsRoot, filepath)
    const normalizedPath = relativePath
      .replace('.mdx', '')
      .replace(/\/index$/, '')

    result.push({
      __type: 'doc',
      frontmatter,
      filepath,
      relativePath,
      normalizedPath,
      slug: normalizedPath,
      load: buildLoadFunction(filepath),
    })
  }

  return result
}
