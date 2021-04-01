import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { existsSync } from 'fsexists'
import requireFromString from 'require-from-string'
import renderToString from 'next-mdx-remote/render-to-string'
import createScope from './utils/create-scope'
import components from './__swingset_components'

// TODO: this whole thing honestly needs a refactor
export default function createStaticProps(swingsetOptions = {}) {
  return async function getStaticProps() {
    // Go through each component, read and format the docs and props files' content
    const docsSrcs = Object.keys(components).map((name) => {
      const component = components[name]
      // Read the docs file, separate content from frontmatter
      const { content, data } = matter(
        fs.readFileSync(component.docsPath, 'utf8')
      )
      //  Read and parse the component's package.json, if possible
      const pathToPackageJson = path.join(component.path, 'package.json')
      const packageJson = existsSync(pathToPackageJson)
        ? JSON.parse(fs.readFileSync(pathToPackageJson, 'utf8'))
        : null

      // Check for a file called 'props.json5' - if it exists, we import it as `props`
      // to the mdx file. This is a nice pattern for knobs and props tables.
      const propsContent =
        existsSync(component.propsPath) &&
        fs.readFileSync(component.propsPath, 'utf8')

      return {
        frontMatter: data,
        props: propsContent,
        propsPath: component.propsPath,
        packageJson,
        // Automatically inject a primary headline containing the component's name
        content: `# \`<${data.componentName}>\` Component\n${content}`,
      }
    })

    const mdxSources = await Promise.all(
      docsSrcs.map(
        ({ content, frontMatter, props, propsPath, packageJson }) => {
          const name = frontMatter.componentName

          // First, we need to get the actual component source
          const Component = components[name].src

          let peerComponents = {}
          if (frontMatter.peerComponents) {
            frontMatter.peerComponents.forEach((name) => {
              const { src } = components[name]
              if (!src) {
                console.warn(`${frontMatter.componentName} lists ${name} as a peerComponent but <${name} /> is not in scope`)
              } else {
                peerComponents = Object.assign(peerComponents, {
                  [name]: src,
                })
              }
            })
          }

          // Next, we render the content, passing as the second argument a "scope" object, which contains
          // our component and some additional presentational components that are made available in the mdx file.
          return renderToString(content, {
            components: createScope({ [name]: Component }, swingsetOptions, peerComponents),
            scope: {
              componentProps: props
                ? requireFromString(props, propsPath)
                : null,
              packageJson,
            },
            mdxOptions: swingsetOptions.mdxOptions || {},
          }).then((res) => [name, res])
          // transform to an object for easier name/component mapping on the client side
        }
      )
    ).then((res) => {
      return res.reduce((m, [name, result]) => {
        m[name] = result
        return m
      }, {})
    })

    // We need to return both `mdxSources` and `docsSources` so that we have both the component and it's name,
    // which is used to render the sidebar. We remove the `content` from docsSrcs though since it's not needed,
    // to prevent a lot of extra useless data from going over the wire.
    return {
      props: {
        mdxSources,
        componentNames: docsSrcs.map((d) => d.frontMatter.componentName),
      },
    }
  }
}
