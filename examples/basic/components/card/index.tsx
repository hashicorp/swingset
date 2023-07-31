/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export function Card({ children }) {
  return (
    <div style={{ border: '1px solid gray', borderRadius: '4px' }}>
      {children}
    </div>
  )
}
