/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'

interface AccordionProps {
 color?: string
 children: ReactElement
}

export function Accordion({ children }: AccordionProps) {
 return (
  <details>
   <summary>Hello 👋</summary>
   Nice meeting you! How's everything going?
  </details>
 )
}
