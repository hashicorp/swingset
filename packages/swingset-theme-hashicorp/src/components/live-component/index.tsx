'use client'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react'
import { Children } from 'react'
import { getFileMap } from './get-file-map'
import { sandpackTheme } from './code-theme'

type LiveComponentProps = {
  children: string[]
  deps?: Record<string, string>
}

export function LiveComponent({ children, deps }: LiveComponentProps) {
  const codeSnippets = Children.toArray(children) as React.ReactElement[]
  const fileMap = getFileMap(codeSnippets)

  const dependencies = deps ?? undefined

  return (
    <>
      <SandpackProvider
        template="react-ts"
        files={fileMap}
        theme={sandpackTheme}
        customSetup={{ dependencies }}
      >
        <div className="flex ss-flex-col ss-w-full ss-border-4 ss-border-gray-300 ss-rounded-lg">
          <SandpackPreview className="ss-h-[45vh] ss-max-h-[800px] ss-min-h-[280px]" />
          <div className="ss-bg-black ss-overflow-y-scroll">
            <SandpackCodeEditor
              showInlineErrors
              showTabs
              showRunButton
              wrapContent
            />
          </div>
        </div>
      </SandpackProvider>
    </>
  )
}
/**
 * The default layout styles for Sandpack
 */
