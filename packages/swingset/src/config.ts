const DEFAULT_CONFIG = {
  componentRoot: './components',
  docsRoot: './app/(swingset)/swingset/docs',
}

export interface SwingsetConfig {
  componentRoot: string
  docsRoot: string
}

export function applyConfigDefaults(
  config: Partial<SwingsetConfig>
): SwingsetConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  }
}
