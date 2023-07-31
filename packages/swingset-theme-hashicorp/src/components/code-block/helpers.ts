/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Language, MDXPreClass, MDXPreElement } from '@/types'

export const parseCode = (toParse: MDXPreElement | string): string => {
  if (typeof toParse === 'string') return toParse.trimEnd()
  return toParse.props.children.trimEnd()
}

export const parseLanguage = (langString: MDXPreClass): Language => {
  const MDXprefix = 'language-'
  const lang = langString.replace(MDXprefix, '')

  if (isSupportedLanguage(lang)) {
    return lang as Language
  }

  throw new Error(
    `Expected (js | ts | jsx | tsx) in your CodeBlock meta data. Received ${lang}`
  )
}

const isSupportedLanguage = (lang: string): boolean => {
  return lang === 'js' || lang === 'jsx' || lang === 'ts' || lang === 'tsx'
}
