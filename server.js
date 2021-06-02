import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { existsSync } from 'fsexists'
import requireFromString from 'require-from-string'
import { serialize } from 'next-mdx-remote/serialize'
import components from './__swingset_components'

export function createStaticPaths() {
  return function getStaticPaths() {
    return {
      paths: Object.values(components).map((componentConfig) => {
        return { params: { swingset: [componentConfig.slug] } }
      }),
      fallback: true,
    }
  }
}

export function createStaticProps(swingsetOptions = {}) {
  return async function getStaticProps({ params }) {
    // get the name/slug for every component in order to render the nav
    const navData = Object.values(components).map((componentConfig) => ({
      name: componentConfig.data.componentName,
      slug: componentConfig.slug,
    }))

    // get the full source and metadata for the component that's rendered on the current page
    const currentComponentData = Object.values(components).find(
      (componentConfig) => {
        return componentConfig.slug === params.swingset[0]
      }
    )

    console.log(currentComponentData)

    // Read the docs file, separate content from frontmatter
    const { content, data } = matter(
      fs.readFileSync(currentComponentData.docsPath, 'utf8')
    )
    //  Read and parse the component's package.json, if possible
    const pathToPackageJson = path.join(
      currentComponentData.path,
      'package.json'
    )
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

    return { props: { navData, mdxSource } }
  }
}
