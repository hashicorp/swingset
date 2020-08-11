import fs from 'fs'
import components from './.components-meta'
import matter from 'gray-matter'
import { existsSync } from 'fsexists'
import json5 from 'json5'
import renderToString from 'next-mdx-remote/render-to-string'
import createScope from './utils/create-scope'

export default function createStaticProps(octavoOptions = {}) {
  return async function getStaticProps() {
    // Go through each component, read and format the docs and props files' content
    const docsSrcs = Object.keys(components).map((name) => {
      const component = components[name]
      // Read the docs file, separate content from frontmatter
      const { content, data } = matter(
        fs.readFileSync(component.docsPath, 'utf8')
      )

      // Check for a file called 'props.json5' - if it exists, we import it as `props`
      // to the mdx file. This is a nice pattern for knobs and props tables.
      const propsContent =
        existsSync(component.propsPath) &&
        fs.readFileSync(components.propsPath, 'utf8')

      return {
        frontMatter: data,
        props: propsContent,
        // Automatically inject a primary headline containing the component's name
        content: `# \`<${data.componentName}>\` Component\n${content}`,
      }
    })

    const mdxSources = await Promise.all(
      docsSrcs.map(({ content, frontMatter, props }) => {
        const name = frontMatter.componentName

        // First, we need to get the actual component source
        const Component = components[name].src

        // Next, we render the content, passing as the second argument a "scope" object, which contains
        // our component and some additional presentational components that are made available in the mdx file.
        return renderToString(
          content,
          createScope({ [name]: Component }, octavoOptions),
          null,
          props && { componentProps: json5.parse(props) }
        ).then((res) => [name, res])
        // transform to an object for easier name/component mapping on the client side
      })
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
