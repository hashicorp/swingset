export function getPeerComponents(entity, components) {
  const peerComponents = {}

  if (!entity?.data?.peerComponents) return peerComponents

  entity.data.peerComponents.forEach((name) => {
    const { src } = components[name]
    if (!src) {
      console.warn(
        `${
          entity.data.componentName ?? entity.data.name
        } lists ${name} as a peerComponent but <${name} /> is not in scope`
      )
    } else {
      peerComponents[name] = src
    }
  })

  return peerComponents
}
