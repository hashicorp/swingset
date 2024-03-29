export type Language = 'ts' | 'js' | 'jsx' | 'tsx'

export type MDXPreClass = `language-${Language}`

export type MDXPreElement = React.ReactElement<{
  children: string
  className?: MDXPreClass
  filePath?: string
  hidden: boolean
  active?: boolean
}>
