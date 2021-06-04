import createLiveComponent from '../components/live-component'
import createKnobsComponent from '../components/knobs-component'
import PropsTable from '../components/props-table'

export default function createScope(scope, swingsetOptions, peerComponents = {}) {
  const scopeWithCustomComponents = Object.assign(
    {},
    scope,
    swingsetOptions.components || {},
    peerComponents,
  )

  return {
    ...scopeWithCustomComponents,
    LiveComponent: createLiveComponent(scopeWithCustomComponents),
    KnobsComponent: createKnobsComponent(scopeWithCustomComponents),
    PropsTable,
  }
}
