const CONFIG_REGEX = /const nextConfig = \{/

export function convertNextConfig(fileContent: string) {
  return CONFIG_REGEX.test(fileContent)
}
