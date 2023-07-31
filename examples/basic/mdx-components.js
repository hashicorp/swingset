/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import themeComponents from 'swingset-theme-hashicorp/MDXComponents'

export function useMDXComponents(components) {
  // Allows customizing built-in components, e.g. to add styling.
  return {
    Note({ children }) {
      return (
        <div
          style={{
            border: '1px solid red',
            background: 'pink',
            padding: '0.5rem',
            margin: '1rem 0',
          }}
        >
          {children}
        </div>
      )
    },
    ...themeComponents,
    ...components,
  }
}
