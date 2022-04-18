import { ComponentData, FormattedFileEntry } from '../types'

export function getPeerComponents(
  entity: ComponentData | FormattedFileEntry,
  components: Record<string, { exports: { default: JSX.Element } }>
) {
  const peerComponents: Record<string, JSX.Element> = {}

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
