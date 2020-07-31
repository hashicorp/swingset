import createLiveComponent from '../components/live-component'
import createKnobsComponent from '../components/knobs-component'
import PropsTable from '../components/props-table'

export default function createScope(scope, octavoOptions) {
  return {
    ...scope,
    LiveComponent: createLiveComponent(scope),
    KnobsComponent: createKnobsComponent(scope),
    PropsTable,
    ...(octavoOptions.additionalComponents || {}),
  }
}
