const globby = require('globby')
const fs = require('fs')
const path = require('path')
const { existsSync } = require('fsexists')
const matter = require('gray-matter')
const { getOptions } = require('loader-utils')
const slugify = require('slugify')

module.exports = function swingsetComponentsLoader() {
  const { pluginOptions, webpackConfig } = getOptions(this)

  // Resolve components glob
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

  // Resolve docs glob
  const allDocs = globby.sync(`${pluginOptions.docsRoot}`)
  const docsWithNames = formatDocsFilesWithNames(allDocs)
  return generateMetadataFile(componentsWithNames, docsWithNames)
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

// Read the docs file name from the docs file, return the name and path.
// If the docs file doesn't have a name, throw a clear error.
// The format ends up like this: [{ name: 'Test', path: '/path/to/component' }]
function formatDocsFilesWithNames(docs, config) {
  return docs.map((docsFile) => {
    const fileContent = fs.readFileSync(docsFile, 'utf8')
    const { data } = matter(fileContent)
    if (!data.name) {
      throw new Error(
        `The docs file at "${path.replace(
          config.context,
          ''
        )}" is missing metadata. Please add a human-readable name to display in the sidebar as "name" to the front matter at the top of the file.`
      )
    }
    return {
      name: data.name,
      path: docsFile,
      slug: path.basename(docsFile, path.extname(docsFile)),
      data,
    }
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
    return {
      name: data.componentName,
      path: componentDir,
      slug: slugify(data.componentName, { lower: true }),
      data,
    }
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
//     propsPath: '/absolute/path/to/component/props.js',
//     slug: 'componentname',
//     src: ComponentName,
//     data: { componentName: 'ComponentName' }
//   },
//   ...
// }
// ```
function generateMetadataFile(components, docsFiles) {
  const imports = components.reduce((memo, component) => {
    memo += `import ${component.name} from '${component.path}'\n`
    return memo
  }, '')

  const componentsData = components.reduce((acc, component) => {
    // We can't just stringify here, because we need eg
    // src: Button, <<< Button NOT in quotes
    acc += `  '${component.name}': {
      path: '${component.path}',
      docsPath: '${path.join(component.path, 'docs.mdx')}',
      propsPath: '${path.join(component.path, 'props.js')}',
      slug: '${component.slug}',
      src: ${component.name},
      data: ${JSON.stringify(component.data, null, 2)}
    },
  `
    return acc
  }, '')

  const docsData = docsFiles.reduce((acc, docsEntry) => {
    acc[docsEntry.slug] = docsEntry
    return acc
  }, {})

  let contents = ''
  contents += imports + '\n'
  contents += `export const components = {\n${componentsData}\n}\n`
  contents += `export const docs = ${JSON.stringify(docsData, null, 2)}\n`

  //   const contents =
  //     'export const components = {\n' +
  //     components.reduce((memo, component) => {
  //       memo += `  '${component.name}': {
  //     path: '${component.path}',
  //     docsPath: '${path.join(component.path, 'docs.mdx')}',
  //     propsPath: '${path.join(component.path, 'props.js')}',
  //     slug: '${component.slug}',
  //     src: ${component.name},
  //     data: ${JSON.stringify(component.data, null, 2)}
  //   },
  // `
  //       return memo
  //     }, '') +
  //     `}\n`

  return contents
}
