/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import sg from '../shared.module.css'
import s from './style.module.css'
import classnames from 'classnames'
import React, { useState } from 'react'
import { useRestoreUrlState, setUrlState } from '../../utils/url-state'
import createId from '../../utils/create-id'
import scrollToElement from '../../utils/scroll-to-element'
import { Knob, Knobs } from '../../types'

export default function createKnobsComponent(
  scope: Record<string, React.ElementType>
) {
  const name = Object.keys(scope)[0]
  const Component = Object.values(scope)[0]

  return function KnobsComponent({ knobs }: { knobs: Knobs }) {
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
        <div className={sg.save} onClick={() => setUrlState(id, values, true)}>
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

function isKnob(v: any): v is Knob {
  return typeof v === 'object' && v.control
}

function renderControls(
  values: Knobs,
  setValues: (arg: Knobs) => void,
  indentLevel = 0
) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})

  return Object.keys(values).map((k) => {
    const valuesCopy = JSON.parse(JSON.stringify(values))
    const v = values[k]
    let control

    if (isKnob(v)) {
      if (v.control.type === 'text') {
        control = (
          <input
            className={s.input}
            value={v.control.value || v.control.defaultValue}
            onChange={(e) => {
              valuesCopy[k].control.value = e.target.value
              setValues(valuesCopy)
            }}
          />
        )
      }

      if (v.control.type === 'select') {
        control = (
          <select
            className={s.select}
            value={v.control.value || v.control.defaultValue}
            onChange={(e) => {
              valuesCopy[k].control.value = e.target.value
              setValues(valuesCopy)
            }}
          >
            <option>Select an option...</option>
            {v.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )
      }

      if (v.control.type === 'checkbox') {
        control = (
          <input
            type="checkbox"
            className={s.checkbox}
            checked={v.control.checked}
            onChange={(e) => {
              valuesCopy[k].control.value = e.target.checked
              setValues(valuesCopy)
            }}
          />
        )
      }

      if (v.control.type === 'json') {
        control = (
          <div className={classnames({ [s.error]: fieldErrors[k] })}>
            <textarea
              className={s.textarea}
              value={
                fieldErrors[k]
                  ? v.control.value
                  : JSON.stringify(
                      v.control.value || v.control.defaultValue,
                      null,
                      2
                    )
              }
              onChange={(e) => {
                try {
                  valuesCopy[k].control.value = JSON.parse(e.target.value)
                  setFieldErrors((prev) => ({ ...prev, [k]: false }))
                } catch (err) {
                  valuesCopy[k].control.value = e.target.value
                  setFieldErrors((prev) => ({ ...prev, [k]: true }))
                }
                setValues(valuesCopy)
              }}
            />
            <p>{fieldErrors[k] && 'Error parsing JSON'}</p>
          </div>
        )
      }
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
          {isKnob(v) && v.required ? (
            <span className={s.requiredStar} title="required">
              *
            </span>
          ) : (
            ''
          )}
          :
        </label>
        {/* if there's no control, we're nesting, otherwise render the control */}
        {!isKnob(v)
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

function knobsToProps(knobs: Knobs) {
  const props: Record<string, any> = {}
  for (let k in knobs) {
    const knob = knobs[k]

    if (isKnob(knob)) {
      props[k] = (knob.control.value || knob.control.defaultValue) ?? ''
    } else {
      props[k] = knobsToProps(knob)
    }
  }

  return props
}
