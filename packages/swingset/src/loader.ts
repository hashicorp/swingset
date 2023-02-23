import path from 'node:path'
import fs from 'node:fs'
import { compile, CompileOptions } from '@mdx-js/mdx'
import { VFile } from 'vfile'
import { matter } from 'vfile-matter'
import { findPagesDir, existsSync } from 'next/dist/lib/find-pages-dir.js'
import directoryTree from 'directory-tree'
import type { LoaderContext } from 'webpack'

import {
  groupComponentsByCategory,
  resolveComponentMeta,
} from './resolve-component-meta'
import { MARKDOWN_EXTENSION_REGEX } from './constants'
import { getFileFrontmatter } from './get-frontmatter'

interface LoaderOptions {
  isMetaImport: boolean
  isContentImport: boolean
  isThemeImport: boolean
  componentRootPattern: string
  theme: string
}

function getCompileOptions(options?: CompileOptions): CompileOptions {
  return {
    outputFormat: 'program',
    providerImportSource: undefined,
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
    componentRootPattern,
    theme,
  } = context.getOptions()

  context.cacheable(true)

  if (isMetaImport) {
    const docsFiles = resolveDocsMeta()
    if (docsFiles) {
      context.addContextDependency(
        path.join(process.cwd(), 'app', '(swingset)', 'swingset', 'docs')
      )
    }

    context.addContextDependency(path.join(process.cwd(), componentRootPattern))
    const componentMeta = await resolveComponentMeta({ componentRootPattern })
    const result = `export const meta = {
      ${componentMeta
        .map(
          (meta) =>
            `'${meta.slug}': {
            frontmatter: ${JSON.stringify(meta.frontmatter)},
            category: ${JSON.stringify(meta.category)},
            componentPath: ${JSON.stringify(meta.componentPath)},
            slug: ${JSON.stringify(meta.slug)},
            load: () => import('${
              meta.componentPath
            }/docs.mdx').then(mod => mod.default)
          }`
        )
        .join(',\n')}
    };

    export const docsMeta = {
      ${docsFiles
        .map(
          (file) => `'${file.relativePath
            .replace('.mdx', '')
            .replace(/\/index$/, '')}': {
        frontmatter: ${JSON.stringify(file.frontmatter)},
        relativePath: ${JSON.stringify(file.relativePath)},
        path: ${JSON.stringify(file.path)},
        load: () => import('${file.path}').then(mod => mod.default),
      }`
        )
        .join(',\n')}
    };

    export function getComponentMeta(component) {
      return meta[component]
    }

    export function getDocsMeta(component) {
      return docsMeta[component]
    }

    export const categories = ${JSON.stringify(
      groupComponentsByCategory(componentMeta)
    )}`

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

function resolveDocsMeta() {
  const docsDir = getDocsDir()
  let docsFiles: any[] = []

  if (docsDir) {
    const directoryTreeItemCallback: directoryTree.DirectoryTreeCallback = (
      item,
      _,
      stats
    ) => {
      if (stats.isFile()) {
        const contents = fs.readFileSync(item.path, 'utf-8')
        const relativePath = path.relative(docsDir, item.path)
        const frontmatter = getFileFrontmatter(contents)

        docsFiles.push({
          relativePath,
          frontmatter,
          ...item,
        })
      }
    }

    const tree = directoryTree(
      docsDir,
      {
        extensions: MARKDOWN_EXTENSION_REGEX,
        attributes: ['type'],
      },
      directoryTreeItemCallback,
      directoryTreeItemCallback
    )
  }
  return docsFiles
}
