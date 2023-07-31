/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { SandpackFile } from '@codesandbox/sandpack-react'
import { parseCode } from '../code-block/helpers'
import { MDXPreElement } from '@/types'

export const getFileMap = (codeSnippets: MDXPreElement[]) => {
  const fileMap = codeSnippets.reduce(
    (result: Record<string, SandpackFile>, codeSnippet) => {
      const { props } = codeSnippet

      const { filePath, hidden, active, children } = props

      const code = parseCode(children)
      //TODO: LINK TO README, CodeSandbox docs aren't very helpful here
      if (!filePath) {
        throw new Error(
          `<CodeBlock/> is missing a fileName prop. See docs: https://sandpack.codesandbox.io/docs/getting-started/usage#files `
        )
      }

      if (!!result[filePath]) {
        throw new Error(
          `File ${filePath} was defined multiple times. Each file snippet should have a unique path.`
        )
      }
      result[filePath] = {
        code,
        hidden,
        active,
      }

      return result
    },
    {}
  )

  return fileMap
}
