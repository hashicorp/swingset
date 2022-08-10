import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { SerializeOptions } from 'next-mdx-remote/dist/types'
import { ReactNode } from 'react'

export interface PluginOptions {
  docsRoot?: string
  componentsRoot?: string
  verbose?: boolean
}

export interface SwingsetOptions {
  components?: Record<string, ReactNode>
  logo?: JSX.Element
  index?: JSX.Element
  mdxOptions?: SerializeOptions['mdxOptions']
  customMeta?: (componentData: any) => {
    github?: string
    npm?: string
  }
}

export type ComponentData = {
  path: string
  componentFilePath: string
  docsPath: string
  propsPath: string
  slug: string
  exports: any
  data: FileData
}

type SourceType = 'docs' | 'components' | 'index'

type Route = {
  name: string
  slug: string
  sourceType: SourceType
}

export type SwingsetData = {
  components: Record<string, ComponentData>
  docs: Record<string, ComponentData>
}

interface FileData {
  peerComponents?: string[]
  componentName?: string
  componentCategory?: string
  name?: string
}

export type FormattedFileEntry = {
  name: string
  slug: string
  path: string
  data: FileData
}

export interface SwingsetPageProps {
  mdxSource: MDXRemoteSerializeResult
  sourceType: SourceType
  navData: [
    { name: 'Components'; routes: Route[]; name: 'Docs'; routes: Route[] }
  ]
}

export interface Knobs {
  [key: string]: Knob | Knobs
}

export interface Knob {
  control: {
    type: 'text' | 'checkbox' | 'select' | 'json'
    value?: string
    checked?: boolean
    defaultValue?: string
  }
  required?: boolean
  options: string[]
}

export type NavItem = {
  name: string
  category?: string | null
  slug: string
  sourceType: string
}
