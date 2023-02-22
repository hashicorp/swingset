/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'

interface NestedObject {
  /** More nesting */
  foo: {
    /** this is a nested thing */
    bar: string
  }
  /** Nested array */
  baz: string[]
}

export interface Props {
  /** the text for the button */
  text: string
  /** Nested object */
  testObject: NestedObject
  theme: any
  union: string | number
  /** Give me a tuple */
  tuple: [string, number]
  arrayObject: NestedObject[]
}

export default function Button({ text = 'text', testObject, theme }: Props) {
  return (
    <button className={s.root}>
      {text}, {JSON.stringify(testObject)}
    </button>
  )
}

export function ButtonSecondary({ text }: { text: string }) {
  return <button className={s.root}>{text}, secondary</button>
}

export const foo = 'bar'
