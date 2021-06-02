export function getPeerComponents(component, components) {
  const peerComponents = {}

  if (!component.data.peerComponents) return peerComponents

  component.data.peerComponents.forEach((name) => {
    const { src } = components[name]
    if (!src) {
      console.warn(
        `${frontMatter.componentName} lists ${name} as a peerComponent but <${name} /> is not in scope`
      )
    } else {
      peerComponents[name] = src
    }
  })

  return peerComponents
}
