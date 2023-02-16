import fs from 'node:fs'
import path from 'node:path'
import { VFile } from 'vfile'
import { matter } from 'vfile-matter'
import { globbyStream } from 'globby'
import { slug } from 'github-slugger'

interface ComponentMeta {
  frontmatter: Record<string, unknown>
  componentPath: string
  slug: string
}

interface ResolveComponentDocsOptions {
  componentRootPattern: string
}

export function getFileFrontmatter(source: string) {
  const vfile = new VFile(source)

  matter(vfile)

  return vfile.data.matter as Record<string, unknown>
}

export async function resolveComponentDocs({
  componentRootPattern,
}: ResolveComponentDocsOptions) {
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
    const componentPath = path.dirname(String(filepath))
    const componentSlug = slug(componentPath.split('/').pop() as string)

    result.push({
      frontmatter,
      componentPath,
      slug: componentSlug,
    })
  }

  return result
}
