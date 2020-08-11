const fs = require('fs')
const path = require('path')
const PrebuildWebpackPlugin = require('prebuild-webpack-plugin')
// const withTM = require('next-transpile-modules')
const globby = require('globby')
const { existsSync } = require('fsexists')
const matter = require('gray-matter')

module.exports = (pluginOptions = {}) => (nextConfig = {}) => {
  // return withTM(['octavo'])(
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      // normalize componentsRoot path
      pluginOptions.componentsRoot = path.resolve(
        config.context,
        pluginOptions.componentsRoot
          ? pluginOptions.componentsRoot
          : 'components/*'
      )
      // Prebuild plugin will find the components we need and write their metadata to a file.
      // This has to happen here because the path is entirely user-defined and webpack
      // cannot run a full dynamic import on the client side.
      // See: https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
      config.plugins.push(
        new PrebuildWebpackPlugin({
          compilationNameFilter: 'client',
          build: async () => {
            const allComponents = await globby(
              `${pluginOptions.componentsRoot}`,
              { onlyFiles: false }
            )

            const usedComponents = removeComponentsWithoutDocs(
              allComponents,
              pluginOptions,
              config
            )

            const componentsWithNames = formatComponentsWithNames(
              usedComponents,
              config
            )

            writeComponentsMetadataFile(componentsWithNames)
          },
          watch: () => {
            // we need to do the same exact thing here, but only re-write if there are new
            // components. so we should hold a "cache" of existing components
          },
        })
      )

      // Don't clobber previous plugins' webpack functions
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  })
  // )
}

// Go through each component and remove any components folders that don't have
// a "docs.mdx" file, since we don't need to display them. If a component exists
// without a docs page, and verbose mode is active, log a warning.
function removeComponentsWithoutDocs(components, pluginOptions, config) {
  return components.reduce((memo, componentDir) => {
    if (existsSync(path.join(componentDir, 'docs.mdx'))) {
      memo.push(componentDir)
    } else {
      pluginOptions.verbose &&
        console.warn(
          `The component "${componentDir.replace(
            config.context,
            ''
          )}" does not have a "docs.mdx" file and therefore will not be documented.`
        )
    }
    return memo
  }, [])
}

// Read the component name from the docs file, return the name and path.
// If the docs file doesn't have a name, throw a clear error.
// The format ends up like this: [{ name: 'Test', path: '/path/to/component' }]
function formatComponentsWithNames(components, config) {
  return components.map((componentDir) => {
    const docsFileContent = fs.readFileSync(
      path.join(componentDir, 'docs.mdx'),
      'utf8'
    )
    const { data } = matter(docsFileContent)
    if (!data.componentName) {
      throw new Error(
        `The docs file at "${path.replace(
          config.context,
          ''
        )}" is missing metadata. Please add the component's name as you would like it to be imported as "componentName" to the front matter at the top of the file.`
      )
    }
    return { name: data.componentName, path: componentDir }
  })
}

// Write out the component metadata to a file, which is formatted as such:
//
// ```
// import ComponentName from '/absolute/path/to/component'
//
// export default {
//   ComponentName: {
//     path: '/absolute/path/to/component',
//     docsPath: '/absolute/path/to/component/docs.mdx',
//     propsPath: '/absolute/path/to/component/props.json5',
//     src: ComponentName
//   },
//   ...
// }
// ```
function writeComponentsMetadataFile(components) {
  const imports = components.reduce((memo, component) => {
    memo += `import ${component.name} from '${component.path}'\n`
    return memo
  }, '')

  const contents =
    'export default {\n' +
    components.reduce((memo, component) => {
      memo += `  '${component.name}': {
    path: '${component.path}',
    docsPath: '${path.join(component.path, 'docs.mdx')}',
    propsPath: '${path.join(component.path, 'props.json5')}',
    src: ${component.name}
  },
`
      return memo
    }, '') +
    '}\n'

  fs.writeFileSync(
    path.join(__dirname, '.components-meta.js'),
    imports + '\n' + contents
  )
}
