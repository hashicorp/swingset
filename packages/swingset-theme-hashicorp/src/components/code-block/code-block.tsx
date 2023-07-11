'use client' //Library calls hooks internally
import { Highlight, themes } from 'prism-react-renderer'
import { parseCode, parseLanguage } from './helpers'
import { Language, MDXPreClass } from '@/types'
import { CopyButton } from './copy-button'

type CodeBlockProps = {
  filePath: `${string}.${Language}`
  children: React.Component
  className: MDXPreClass
}

function CodeBlock(props: CodeBlockProps) {
  const { children } = props
  const code = parseCode(children)
  const { className } = children.props as typeof children.props & {
    className: MDXPreClass
  }
  const language = parseLanguage(className || 'language-jsx')

  return (
    <div className="ss-mb-6 ss-rounded-md ss-overflow-hidden ss-relative">
      <Highlight code={code} language={language} theme={themes.dracula}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <pre
              className={className + 'ss-bg-black'}
              style={{ ...style, padding: '12px' }}
            >
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
