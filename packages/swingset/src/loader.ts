import path from 'node:path'
import { compile, CompileOptions } from '@mdx-js/mdx'
import { VFile } from 'vfile'
import { matter } from 'vfile-matter'

import type { LoaderContext } from 'webpack'
import { resolveComponentMeta } from './resolve-component-meta'

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
    console.log({ isMetaImport })
    context.addContextDependency(path.join(process.cwd(), componentRootPattern))
    const componentMeta = await resolveComponentMeta({ componentRootPattern })
    const result = `export default {
      ${componentMeta
        .map(
          (meta) =>
            `'${meta.slug}': {
            frontmatter: ${JSON.stringify(meta.frontmatter)},
            componentPath: ${JSON.stringify(meta.componentPath)},
            slug: ${JSON.stringify(meta.slug)},
            loadDocs: () => import('${
              meta.componentPath
            }/docs.mdx').then(mod => mod.default)
          }`
        )
        .join(',\n')}
    };`

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
