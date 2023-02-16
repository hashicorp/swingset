/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'

export default function Button({
  text,
  testObject,
}: {
  text: string
  testObject: Record<string, any>
}) {
  return (
    <button className={s.root}>
      {text}, {JSON.stringify(testObject)}
    </button>
  )
}
