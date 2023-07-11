'use client' //Library calls hooks internally
import { Highlight, themes } from 'prism-react-renderer'
import { parseCode, parseLanguage } from './helpers'
import { MDXPreClass, MDXPreElement } from '@/types'
import { CopyButton } from './copy-button'

interface CodeBlockProps {
  children: MDXPreElement
  className: MDXPreClass
}

function CodeBlock(props: CodeBlockProps) {
  const { children } = props

  const code = parseCode(children)
  const language = parseLanguage(children.props.className ?? 'language-jsx')

  return (
    <div className="ss-mb-6 ss-rounded-md ss-overflow-hidden ss-relative">
      <Highlight code={code} language={language} theme={themes.dracula}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <pre className={'ss-p-3'} style={{ ...style }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, className })} />
                  ))}
                </div>
              ))}
            </pre>
          )
        }}
      </Highlight>
      <CopyButton code={code} />
    </div>
  )
}

export { CodeBlock }
