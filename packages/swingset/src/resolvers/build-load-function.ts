/**
 * Construct a stringified loader for an entity. Returns the default export
 */
export function buildLoadFunction(filepath: string) {
  return `() => import("${filepath}").then(mod => mod.default)`
}
