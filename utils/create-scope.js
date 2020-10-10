import createLiveComponent from '../components/live-component'
import createKnobsComponent from '../components/knobs-component'
import PropsTable from '../components/props-table'

export default function createScope(scope, octavoOptions) {
  const scopeWithCustomComponents = Object.assign(
    {},
    scope,
    octavoOptions.components || {}
  )
  return {
    ...scopeWithCustomComponents,
    LiveComponent: createLiveComponent(scopeWithCustomComponents),
    KnobsComponent: createKnobsComponent(scopeWithCustomComponents),
    PropsTable,
  }
}
