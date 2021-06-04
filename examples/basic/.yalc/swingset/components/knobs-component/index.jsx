import sg from '../shared.module.css'
import s from './style.module.css'
import { useState } from 'react'
import { useRestoreUrlState, setUrlState } from '../../utils/url-state'
import createId from '../../utils/create-id'
import scrollToElement from '../../utils/scroll-to-element'

export default function createKnobsComponent(scope) {
  const name = Object.keys(scope)[0]
  const Component = Object.values(scope)[0]

  return function KnobsComponent({ knobs }) {
    const id = createId(knobs)
    const [values, setValues] = useState(knobs)

    // if there's url state and it applies to this element, restore it
    useRestoreUrlState((qs) => {
      if (qs.id == id) {
        setValues(qs.values)
        scrollToElement(id)
      }
    })

    return (
      <div className={s.knobs} id={id}>
        <div
          className={sg.save}
          onClick={() => setUrlState(name, id, values, true)}
        >
          Share
        </div>
        <Component {...knobsToProps(values)} />
        <div>
          <h6 className={sg.label}>Controls</h6>
          {renderControls(values, setValues)}
        </div>
      </div>
    )
  }
}

function renderControls(values, setValues, indentLevel = 0) {
  return Object.keys(values).map((k) => {
    const valuesCopy = JSON.parse(JSON.stringify(values))
    const v = values[k]
    let control

    if (v.control === 'text') {
      control = (
        <input
          className={s.input}
          value={v.value || v.defaultValue}
          onChange={(e) => {
            valuesCopy[k].value = e.target.value
            setValues(valuesCopy)
          }}
        />
      )
    }

    if (v.control === 'select') {
      control = (
        <select
          className={s.select}
          value={v.value || v.defaultValue}
          onChange={(e) => {
            valuesCopy[k].value = e.target.value
            setValues(valuesCopy)
          }}
        >
          <option value={null}>Select an option...</option>
          {v.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    }

    if (v.control === 'checkbox') {
      control = (
        <input
          type="checkbox"
          className={s.checkbox}
          checked={v.value || v.defaultValue}
          onChange={(e) => {
            valuesCopy[k].value = e.target.checked
            setValues(valuesCopy)
          }}
        />
      )
    }

    if (v.control === 'json') {
      control = (
        <textarea
          className={s.textarea}
          value={JSON.stringify(v.value || v.defaultValue, null, 2)}
          onChange={(e) => {
            valuesCopy[k].value = JSON.parse(e.target.value)
            setValues(valuesCopy)
          }}
        />
      )
    }

    return (
      <div
        className={`${s.field} indent-${indentLevel} ${
          v.control ? s.contained : ''
        }`}
        key={k}
      >
        <label>
          {k}
          {v.required ? (
            <span className={s.requiredStar} title="required">
              *
            </span>
          ) : (
            ''
          )}
          :
        </label>
        {/* if there's no control, we're nesting, otherwise render the control */}
        {!v.control
          ? renderControls(
              v,
              (subtreeValue) => {
                valuesCopy[k] = subtreeValue
                setValues(valuesCopy)
              },
              indentLevel + 1
            )
          : control}
      </div>
    )
  })
}

function knobsToProps(knobs) {
  const props = {}
  for (let k in knobs) {
    props[k] = knobs[k].value || knobs[k].defaultValue
    if (
      typeof props[k] === 'undefined' &&
      Object.keys(knobs[k]).length > 0 &&
      typeof knobs[k] !== 'string'
    ) {
      props[k] = knobsToProps(knobs[k])
    }
  }
  return props
}
