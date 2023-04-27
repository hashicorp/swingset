import fs from 'node:fs'
import path from 'node:path'
import { globbyStream } from 'globby'
import { slug } from 'github-slugger'
import { getFileFrontmatter } from '../get-frontmatter'
import { ComponentEntity } from '../types'
import { buildLoadFunction } from './build-load-function'

interface ComponentResolverOptions {
  componentRoot: string
}

// TODO: how to support additional functionality here? We should support attaching additional metadata, like parsing types for props
export async function resolveComponents({
  componentRoot,
}: ComponentResolverOptions) {
  const componentRootPath = path.join(process.cwd(), componentRoot)
  const result: ComponentEntity[] = []

  for await (const filepathRaw of globbyStream([componentRoot], {
    expandDirectories: {
      extensions: ['mdx'],
    },
    onlyFiles: true,
    absolute: true,
  })) {
    const filepath = String(filepathRaw)
    const contents = await fs.promises.readFile(filepath, 'utf-8')

    const frontmatter = getFileFrontmatter(contents)
    const componentPath = path.relative(process.cwd(), path.dirname(filepath))
    const relativePath = path.relative(process.cwd(), filepath)
    const normalizedPath = path.relative(componentRootPath, componentPath)
    const componentSlug = slug(componentPath.split('/').pop() as string)

    result.push({
      __type: 'component',
      frontmatter,
      category: (frontmatter.category as string) ?? 'default',
      title: (frontmatter.title as string) ?? componentSlug,
      filepath,
      relativePath,
      normalizedPath,
      componentPath,
      slug: componentSlug,
      load: buildLoadFunction(filepath),
    })
  }

  return result
}
