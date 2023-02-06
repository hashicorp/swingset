/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'

export default function Header({ text }: { text: string }) {
  return (
    <div className={s.root}>
      <h1>{text}</h1>
    </div>
  )
}
