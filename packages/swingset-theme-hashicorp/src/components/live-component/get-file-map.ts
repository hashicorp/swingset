import type { SandpackFile } from '@codesandbox/sandpack-react'
import { parseCode } from '../code-block/helpers'

export const getFileMap = (codeSnippets: React.ReactElement[]) => {
  const fileMap = codeSnippets.reduce(
    (result: Record<string, SandpackFile>, codeSnippet: React.ReactElement) => {
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
