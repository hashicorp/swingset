import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { existsSync } from 'fsexists'
import requireFromString from 'require-from-string'
import { serialize } from 'next-mdx-remote/serialize'
import { findEntity } from './utils/find-entity'
import { components, docs } from './__swingset_data'

export function createStaticPaths() {
  return function getStaticPaths() {
    // Path for index page
    const indexPage = { params: { swingset: [] } }
    // Paths for components
    const componentPaths = Object.values(components).map((componentConfig) => {
      return { params: { swingset: ['components', componentConfig.slug] } }
    })
    // Paths for docs pages
    // @TODO - doing single level of docs pages to start,
    // we could expand this to nested docs, but not doing that for now
    const docsPaths = Object.values(docs).map((docsEntry) => {
      return { params: { swingset: ['docs', docsEntry.slug] } }
    })
    // Return all paths
    return {
      paths: [indexPage, ...componentPaths, ...docsPaths],
      fallback: false,
    }
  }
}

export function createStaticProps(swingsetOptions = {}) {
  return async function getStaticProps({ params }) {
    // get the name/slug for every component in order to render the nav
    const navDataComponents = Object.values(components).map(
      (componentConfig) => ({
        name: componentConfig.data.componentName,
        slug: componentConfig.slug,
        sourceType: 'components',
      })
    )
    const navDataDocsPages = Object.values(docs).map((docsEntry) => ({
      name: docsEntry.name,
      slug: docsEntry.slug,
      sourceType: 'docs',
    }))

    const navData = [
      {
        name: 'Components',
        routes: navDataComponents,
      },
      {
        name: 'Docs',
        routes: navDataDocsPages,
      },
    ]

    // the first route segment dictates how we load data
    const sourceType = !params.swingset ? 'index' : params.swingset[0]

    const mdxSource =
      sourceType === 'components'
        ? await getComponentMdxSource(params, swingsetOptions)
        : sourceType == 'docs'
        ? await getDocsMdxSource(params, swingsetOptions)
        : null

    return { props: { sourceType, navData, mdxSource } }
  }
}

async function getDocsMdxSource(params, swingsetOptions) {
  const currentDocsData = findEntity(params)
  // Read the docs file, separate content from frontmatter
  const { content, data } = matter(
    fs.readFileSync(currentDocsData.path, 'utf8')
  )
  // Generate MDX source for the docs page
  const mdxSource = await serialize(content, {
    mdxOptions: swingsetOptions.mdxOptions || {},
  })
  return mdxSource
}

async function getComponentMdxSource(params, swingsetOptions) {
  // get the full source and metadata for the component that's rendered on the current page
  const currentComponentData = findEntity(params)

  // Read the docs file, separate content from frontmatter
  const { content, data } = matter(
    fs.readFileSync(currentComponentData.docsPath, 'utf8')
  )
  //  Read and parse the component's package.json, if possible
  const pathToPackageJson = path.join(currentComponentData.path, 'package.json')
  const packageJson = existsSync(pathToPackageJson)
    ? JSON.parse(fs.readFileSync(pathToPackageJson, 'utf8'))
    : null

  // Check for a file called 'props.js' - if it exists, we import it as `props`
  // to the mdx file. This is a nice pattern for knobs and props tables.
  const propsContent =
    existsSync(currentComponentData.propsPath) &&
    fs.readFileSync(currentComponentData.propsPath, 'utf8')

  // Inject a primary headline with the component's name above the content
  const contentWithHeadline = `# \`<${data.componentName}>\` Component\n${content}`

  // Serialize the content using mdx-remote
  const mdxSource = await serialize(contentWithHeadline, {
    scope: {
      // TODO: process props using marked here?
      componentProps: propsContent
        ? requireFromString(propsContent, currentComponentData.propsPath)
        : null,
      packageJson,
    },
    mdxOptions: swingsetOptions.mdxOptions || {},
  })
  return mdxSource
}
