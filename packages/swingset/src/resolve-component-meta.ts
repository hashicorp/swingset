import fs from 'node:fs'
import path from 'node:path'
import { globbyStream } from 'globby'
import { slug } from 'github-slugger'
import { getFileFrontmatter } from './get-frontmatter'

interface ComponentMeta {
  frontmatter: Record<string, unknown>
  category: string
  componentPath: string
  slug: string
}

interface ResolveComponentMetaOptions {
  componentRootPattern: string
}

export async function resolveComponentMeta({
  componentRootPattern,
}: ResolveComponentMetaOptions) {
  const result: ComponentMeta[] = []

  for await (const filepath of globbyStream([componentRootPattern], {
    expandDirectories: {
      extensions: ['mdx'],
    },
    onlyFiles: true,
    absolute: true,
  })) {
    const contents = await fs.promises.readFile(filepath, 'utf-8')

    const frontmatter = getFileFrontmatter(contents)
    const componentPath = path.relative(
      process.cwd(),
      path.dirname(String(filepath))
    )
    const componentSlug = slug(componentPath.split('/').pop() as string)

    result.push({
      frontmatter,
      category: (frontmatter.category as string) ?? 'default',
      componentPath,
      slug: componentSlug,
    })
  }

  return result
}

// TODO: sort
export function groupComponentsByCategory(components: ComponentMeta[]) {
  let result: Record<string, string[]> = {}

  for (const component of components) {
    result[component.category] ||= []

    result[component.category].push(component.slug)
  }

  return result
}
