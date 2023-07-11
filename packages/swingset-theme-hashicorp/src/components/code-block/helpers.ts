import { Language, MDXPreClass } from '@/types'

export const parseCode = (children: React.Component): string | never => {
  if (typeof children === 'string') {
    return (children as string).trimEnd()
  }

  if ('children' in children.props) {
    return parseCode(children.props.children as React.Component)
  }

  //TODO: Link to README.md
  throw Error('Unable to Find valid <CodeBlock/> component. See docs:')
}

export const parseLanguage = (langString: MDXPreClass): Language | never => {
  const MDXprefix = 'language-'
  const lang = langString.replace(MDXprefix, '')

  if (isSupportedLanguage(lang)) {
    return lang as Language
  }

  throw new Error(
    `Expected (js | ts | jsx | tsx) in your CodeBlock meta data. Received ${lang}`
  )
}

const isSupportedLanguage = (lang: string): true | false => {
  return lang === 'js' || lang === 'jsx' || lang === 'ts' || lang === 'tsx'
}
