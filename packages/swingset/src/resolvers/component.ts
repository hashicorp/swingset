import fs from 'node:fs'
import path from 'node:path'
import { globbyStream } from 'globby'
import { slug } from 'github-slugger'
import { getFileFrontmatter } from '../get-frontmatter.js'
import { ComponentEntity } from '../types.js'
import { buildLoadFunction } from './build-load-function.js'
import { parseComponentPath } from '../parse-component-path.js'

const DOCS_DIRECTORY = 'docs'

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

    const isNestedDocument = componentSlug === DOCS_DIRECTORY

    if (isNestedDocument) {
      const filename = path.basename(filepath, '.mdx')

      // detect index.mdx
      // TODO: warn if docs.mdx and docs/index.mdx exist
      const isIndexDocument = filename === 'index'

      // correctly detect the component path
      const parentComponentPath = path.dirname(componentPath)
      const normalizedNestedPath = path.relative(
        componentRootPath,
        path.join(parentComponentPath, filename)
      )
      const title =
        (frontmatter.title as string) ??
        `${parentComponentPath.split('/').pop()} ${filename}`

      result.push({
        __type: 'component',
        category: parentComponentPath,
        componentPath: parentComponentPath,
        filepath,
        frontmatter,
        isNested: true,
        load: buildLoadFunction(filepath),
        normalizedPath: normalizedNestedPath,
        relativePath,
        slug: normalizedNestedPath,
        title,
        parsedPath: parseComponentPath(relativePath)
      })
    } else {
      result.push({
        __type: 'component',
        category: (frontmatter.category as string) ?? 'default',
        componentPath,
        filepath,
        frontmatter,
        load: buildLoadFunction(filepath),
        normalizedPath,
        relativePath,
        slug: componentSlug,
        title: (frontmatter.title as string) ?? componentSlug,
        parsedPath: parseComponentPath(relativePath)
      })
    }
  }

  return result
}
