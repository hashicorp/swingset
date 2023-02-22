/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'

export interface Props {
  /** link text */
  text: string
  /** link URL */
  href: string
}

export default function Link({ text, href }: Props) {
  return (
    <a className={s.root} href={href}>
      {text}
    </a>
  )
}
