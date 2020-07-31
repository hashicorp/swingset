import fs from "fs";
import globby from "globby";
import matter from "gray-matter";
import { existsSync } from "fsexists";
import json5 from "json5";
import renderToString from "next-mdx-remote/render-to-string";
import allComponents, { _importMeta } from "../packages/*";
import findComponent from "./utils/find-component";
import createScope from "./utils/create-scope";

export default function createStaticProps(octavoOptions = {}) {
  if (!octavoOptions.componentsRoot)
    octavoOptions.componentsRoot = "components/*";

  return async function getStaticProps() {
    // first we read all the docs page files from packages
    const docsPaths = globby.sync(
      `${process.cwd()}/${octavoOptions.componentsRoot}/docs.mdx`
    );

    // now we go through each one, read the data, and extract the frontmatter
    const docsSrcs = docsPaths.map((path) => {
      const { content, data } = matter(fs.readFileSync(path, "utf8"));

      // we also will check for a file called 'props.json5', if it exists, we import it as `props`
      // to the mdx file. this is a nice pattern for knobs and props tables
      const propsFilePath = path.replace(/\/docs\.mdx$/, "/props.json5");
      const propsContent =
        existsSync(propsFilePath) && fs.readFileSync(propsFilePath, "utf8");

      if (!data.componentName) {
        throw new Error(
          `The docs file at "${path.replace(
            process.cwd(),
            ""
          )}" is missing metadata. Please add the component's name as you would like it to be imported as "componentName" to the front matter at the top of the file.`
        );
      }

      return {
        path,
        data,
        props: propsContent,
        // Automatically inject a primary headline containing the component's name
        content: `# \`<${data.componentName}>\` Component\n${content}`,
      };
    });

    const mdxSources = await Promise.all(
      docsSrcs.map(({ content, data, props }) => {
        // First, we need to get the actual component, which we use a utility function for
        const Component = findComponent(data.componentName, {
          docsSrcs,
          allComponents,
          _importMeta,
        });

        // Finally, we render the content, passing as the second argument a "scope" object, which contains
        // our component and some additional presentational components that are made available in the mdx file.
        return renderToString(
          content,
          createScope({ [data.componentName]: Component }, octavoOptions),
          null,
          props && { componentProps: json5.parse(props) }
        ).then((res) => [data.componentName, res]);
      })
    ).then((res) => {
      // transform to an object for easier name/component mapping on the client side
      return res.reduce((m, [name, result]) => {
        m[name] = result;
        return m;
      }, {});
    });

    // We need to return both `mdxSources` and `docsSources` so that we have both the component and it's name,
    // which is used to render the sidebar. We remove the `content` from docsSrcs though since it's not needed,
    // to prevent a lot of extra useless data from going over the wire.
    return {
      props: {
        mdxSources,
        docsSrcs: docsSrcs.map((d) => {
          delete d.content;
          return d;
        }),
      },
    };
  };
}
