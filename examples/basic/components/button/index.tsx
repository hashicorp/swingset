/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'

interface ButtonProps {
  color?: string
  children: ReactElement
}

export function Button({ children }: ButtonProps) {
  return <button>{children}</button>
}
