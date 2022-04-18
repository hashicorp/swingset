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
  docsPath: string
  propsPath: string
  slug: string
  exports: any
  data: { peerComponents?: string[]; componentName?: string; name?: string }
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

export type FormattedFileEntry = {
  name: string
  slug: string
  path: string
  data: { peerComponents?: string[]; componentName?: string; name?: string }
}

export interface PageProps {
  mdxSource: MDXRemoteSerializeResult
  sourceType: SourceType
  navData: [
    { name: 'Components'; routes: Route[]; name: 'Docs'; routes: Route[] }
  ]
}
