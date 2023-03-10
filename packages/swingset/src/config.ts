const DEFAULT_CONFIG = {
  componentRoot: './components',
  docsRoot: './app/(swingset)/swingset/docs',
  theme: 'swingset/default-theme',
}

export interface SwingsetConfig {
  componentRoot: string
  docsRoot: string
  theme: string
}

export function applyConfigDefaults(
  config: Partial<SwingsetConfig>
): SwingsetConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  }
}
