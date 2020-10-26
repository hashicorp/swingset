const globby = require('globby')
const fs = require('fs')
const path = require('path')
const { existsSync } = require('fsexists')
const matter = require('gray-matter')
const { getOptions } = require('loader-utils')

module.exports = function octavoComponentsLoader() {
  const { pluginOptions, webpackConfig } = getOptions(this)

  const allComponents = globby.sync(`${pluginOptions.componentsRoot}`, {
    onlyFiles: false,
  })

  const usedComponents = removeComponentsWithoutDocs(
    allComponents,
    pluginOptions,
    webpackConfig
  )

  addWebpackDependencies.call(this, usedComponents)
  const componentsWithNames = formatComponentsWithNames(
    usedComponents,
    webpackConfig
  )
  return generateComponentsMetadataFile(componentsWithNames)
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

// Add the component folder as a dependency so webpack knows when to reload
function addWebpackDependencies(components) {
  components.map((componentDir) => {
    this.addContextDependency(componentDir)
  })
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
function generateComponentsMetadataFile(components) {
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
    propsPath: '${path.join(component.path, 'props.js')}',
    src: ${component.name}
  },
`
      return memo
    }, '') +
    '}\n'

  return imports + '\n' + contents
}
