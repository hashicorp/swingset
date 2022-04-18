import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
// @ts-ignore
import { existsSync } from 'fsexists'
import requireFromString from 'require-from-string'
import { serialize } from 'next-mdx-remote/serialize'
import { findEntity } from './utils/find-entity'
import { components, docs } from './__swingset_data'
import type { ComponentData, PageProps, SwingsetOptions } from './types'
import { NextParsedUrlQuery } from 'next/dist/server/request-meta'
import { GetStaticProps, GetStaticPropsContext } from 'next'

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
  return async function getStaticProps({ params }: GetStaticPropsContext) {
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
    const sourceType = !params!.swingset ? 'index' : params!.swingset[0]

    const mdxSource =
      sourceType === 'components'
        ? await getComponentMdxSource(params!, swingsetOptions)
        : sourceType == 'docs'
        ? await getDocsMdxSource(params!, swingsetOptions)
        : null

    return { props: { sourceType, navData, mdxSource } as PageProps }
  }
}

async function getDocsMdxSource(
  params: NextParsedUrlQuery,
  swingsetOptions: SwingsetOptions
) {
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

async function getComponentMdxSource(
  params: NextParsedUrlQuery,
  swingsetOptions: SwingsetOptions
) {
  // get the full source and metadata for the component that's rendered on the current page
  const currentComponentData = findEntity(params) as ComponentData

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
  let contentWithHeadline = `<div className='__swingset-headline'>
  <h1><code>&lt;${data.componentName}&gt;</code> Component</h1>`

  // If custom metadata is called for, add it below the headline
  if (swingsetOptions.customMeta) {
    const customMeta = swingsetOptions.customMeta(currentComponentData)
    contentWithHeadline += '\n<div className="__swingset-meta">'

    if (customMeta.github) {
      contentWithHeadline += `<a className='__swingset-meta-github' target='_blank' rel='noopener' href='${customMeta.github}' title='View Source on GitHub'></a>`
    }

    if (customMeta.npm) {
      contentWithHeadline += `<a className='__swingset-meta-npm' target='_blank' rel='noopener' href='${customMeta.npm}' title='View NPM Package'></a>`
    }

    contentWithHeadline += '\n</div>'
  }

  contentWithHeadline += `\n</div>\n${content}`

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
