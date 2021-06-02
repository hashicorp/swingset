export function findComponent(components, params) {
  return Object.values(components).find((componentConfig) => {
    return componentConfig.slug === params.swingset[1]
  })
}
