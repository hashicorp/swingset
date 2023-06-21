import path from 'node:path'
import { compile, CompileOptions } from '@mdx-js/mdx'
import { VFile } from 'vfile'
import { matter } from 'vfile-matter'
import { type LoaderContext } from 'webpack'
import { resolveComponents } from './resolvers/component.js'
import { stringifyEntity } from './resolvers/stringify-entity.js'
import { getNavigationTree } from './get-navigation-tree.js'
import { resolveDocs } from './resolvers/doc.js'
import { NEXT_MDX_COMPONENTS_ALIAS } from './constants.js'
import { type SwingsetConfig } from './config.js'
import { type Entity } from './types.js'
import { getRelatedComponentPropsMetadata } from './get-props.js'

type LoaderOptions = {
  isMetaImport: boolean
  isContentImport: boolean
  isComponentImport: boolean
  isThemeImport: boolean
} & SwingsetConfig

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
    isComponentImport,
    componentRoot,
    docsRoot,
    theme,
    remarkPlugins,
    rehypePlugins,
  } = context.getOptions()

  context.cacheable(true)

  if (isMetaImport) {
    const entities: Entity[] = [
      ...(await resolveComponents({ componentRoot })),
      ...(await resolveDocs({ docsRoot })),
    ]
    context.addContextDependency(path.join(process.cwd(), componentRoot))
    context.addContextDependency(path.join(process.cwd(), docsRoot))

    const result = `
      export const meta = {
        ${entities
          .map((entity) => `'${entity.slug}': ${stringifyEntity(entity)}`)
          .join(',\n')}
      };

      export function getEntity(slug) {
        return meta[slug]
      }

      export function getNestedEntities(slug) {
        const entity = meta[slug]

        if (!entity) return []

        return Object.values(meta).filter(e => e.isNested && e.componentPath === entity.componentPath)
      }

      export function generateStaticParams() {
        return Object.keys(meta).map(slug => ({ path: slug.split('/') }))
      }

      export const categories = ${JSON.stringify(getNavigationTree(entities))}
    `

    return result
  }

  if (isContentImport) {
    const { result, frontmatter } = await compileMDX(source, {
      jsx: true,
      format: 'detect',
      remarkPlugins,
      rehypePlugins,
    })

    const mdxModule = String(result)
    const stringifiedFrontmatter = JSON.stringify(frontmatter) || '{}'

    const mod = `${mdxModule}

export const frontmatter = ${stringifiedFrontmatter};
  `

    return mod
  }

  // Append prop metadata to a component when imported from an mdx file
  if (isComponentImport) {
    let mod = source

    try {
      const propsMetadata = await getRelatedComponentPropsMetadata({
        source,
        filepath: context.resourcePath,
        directory: path.dirname(context.resourcePath),
      })

      // TODO: this breaks if the function name is not the same as the computed displayName from react-docgen
      mod = `${source}

${propsMetadata.map((metadata) => {
  // @ts-expect-error -- displayName exists on the actual object. Fixed upstream
  return `${metadata.displayName}.propsMetadata = ${JSON.stringify(metadata)};`
})}
`
    } catch (error) {
      console.log(
        `[swingset/loader] error detecting props metadata for component file: ${context.resourcePath}`,
        error
      )
    }

    return mod
  }

  if (isThemeImport) {
    return `
      import Theme, { Page as ThemePage } from '${theme}';
      import { createPage } from 'swingset/create-page';

      export default Theme;
      export const Page = createPage(ThemePage);
    `
  }
}
