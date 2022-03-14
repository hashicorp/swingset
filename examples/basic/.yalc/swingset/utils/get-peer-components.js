export function getPeerComponents(entity, components) {
  const peerComponents = {}

  if (!entity?.data?.peerComponents) return peerComponents

  entity.data.peerComponents.forEach((name) => {
    const component = components[name]
    if (!component) {
      console.warn(
        `${
          entity.data.componentName ?? entity.data.name
        } lists ${name} as a peerComponent but <${name} /> is not in scope`
      )
    } else {
      peerComponents[name] = component.exports.default
    }
  })

  return peerComponents
}
