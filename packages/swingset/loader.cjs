/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * @typedef {import('webpack').LoaderContext<unknown>} LoaderContext
 *
 * ref: https://github.com/mdx-js/mdx/blob/main/packages/loader/index.cjs
 */

/**
 * Webpack loader
 *
 * @todo once webpack supports ESM loaders, remove this wrapper.
 *
 * @this {LoaderContext}
 * @param {string} code
 */
module.exports = function (code) {
  const callback = this.async()
  // Note that `import()` caches, so this should be fast enough.
  import('./dist/loader.js').then((module) =>
    module
      .loader(this, code)
      .then((result) => callback(null, result))
      .catch((err) => callback(err))
  )
}
