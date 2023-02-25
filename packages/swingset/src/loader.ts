import path from 'node:path'
import { compile, CompileOptions } from '@mdx-js/mdx'
import { VFile } from 'vfile'
import { matter } from 'vfile-matter'
import { findPagesDir, existsSync } from 'next/dist/lib/find-pages-dir.js'
import type { LoaderContext } from 'webpack'

import { resolveComponents } from './resolvers/component'
import { Entity } from './types'
import { stringifyEntity } from './resolvers/stringify-entity'
import { getCategories } from './get-categories'
import { resolveDocs } from './resolvers/doc'
import { NEXT_MDX_COMPONENTS_ALIAS } from './constants'

interface LoaderOptions {
  isMetaImport: boolean
  isContentImport: boolean
  isThemeImport: boolean
  componentRoot: string
  docsRoot: string
  theme: string
}

function getCompileOptions(options?: CompileOptions): CompileOptions {
  return {
    outputFormat: 'program',
    providerImportSource: NEXT_MDX_COMPONENTS_ALIAS,
    ...options,
  }
}

async function compileMDX(source: string, options?: CompileOptions) {
  const vfile = new VFile(source)

  matter(vfile, { strip: true })

  const result = await compile(vfile, getCompileOptions(options))

  return { result, frontmatter: vfile.data.matter }
}

export async function loader(
  context: LoaderContext<LoaderOptions>,
  source: string
): Promise<string | undefined> {
  const {
    isMetaImport,
    isContentImport,
    isThemeImport,
    componentRoot,
    docsRoot,
    theme,
  } = context.getOptions()

  context.cacheable(true)

  if (isMetaImport) {
    const entities: Entity[] = [
      ...(await resolveComponents({ componentRoot })),
      ...(await resolveDocs({ docsRoot })),
    ]

    context.addContextDependency(path.join(process.cwd(), componentRoot))
    context.addContextDependency(path.join(process.cwd(), docsRoot))

    const result = `export const meta = {
      ${entities
        .map(
          (entity) => `'${entity.normalizedPath}': ${stringifyEntity(entity)}`
        )
        .join(',\n')}
    };

    export function getEntity(slug) {
      return meta[slug]
    }

    export function generateStaticParams() {
      return Object.keys(meta).map(slug => ({ path: slug.split('/') }))
    }
    
    export const categories = ${JSON.stringify(getCategories(entities))}`

    return result
  }

  if (isContentImport) {
    const { result, frontmatter } = await compileMDX(source, {
      jsx: true,
      format: 'detect',
    })

    const mdxModule = String(result)
    const stringifiedFrontmatter = JSON.stringify(frontmatter) || '{}'

    const mod = `${mdxModule}
  
export const frontmatter = ${stringifiedFrontmatter};
  `

    return mod
  }

  if (isThemeImport) {
    return `import Theme, { Page } from '${theme}';

export default Theme;
export { Page };`
  }
}

function getDocsDir() {
  const { appDir } = findPagesDir(process.cwd(), true)

  if (!appDir) {
    throw new Error(
      '[swingset/loader] app directory not detected, ensure experimental.appDir is set to true'
    )
  }

  // TODO: make the swingset path configurable?
  const docsDir = path.join(appDir, '(swingset)', 'swingset', 'docs')

  if (existsSync(docsDir)) {
    return docsDir
  } else {
    return false
  }
}
