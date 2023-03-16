import { CompileOptions } from '@mdx-js/mdx'

const DEFAULT_CONFIG = {
  componentRoot: './components',
  docsRoot: './app/(swingset)/swingset/docs',
  theme: 'swingset/default-theme',
  remarkPlugins: [],
  rehypePlugins: [],
}

export interface SwingsetConfig {
  componentRoot: string
  docsRoot: string
  theme: string
  remarkPlugins: CompileOptions['remarkPlugins']
  rehypePlugins: CompileOptions['rehypePlugins']
}

export function applyConfigDefaults(
  config: Partial<SwingsetConfig>
): SwingsetConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  }
}
