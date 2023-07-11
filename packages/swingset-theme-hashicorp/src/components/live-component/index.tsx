'use client'
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react'
import { Children } from 'react'
import { getFileMap } from './get-file-map'
import { sandpackTheme } from './code-theme'
import { MDXPreElement } from '@/types'

type LiveComponentProps = {
  children: MDXPreElement
  deps?: Record<string, string>
}

export function LiveComponent({ children, deps }: LiveComponentProps) {
  const codeBlocks = Children.toArray(children)
  const fileMap = getFileMap(codeBlocks as MDXPreElement[])

  return (
    <SandpackProvider
      template="react-ts"
      files={fileMap}
      theme={sandpackTheme}
      customSetup={{ dependencies: deps }}
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
  )
}
