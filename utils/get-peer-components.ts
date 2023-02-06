/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import { ComponentData, FormattedFileEntry } from '../types'

export function getPeerComponents(
  entity: ComponentData | FormattedFileEntry,
  components: Record<string, { exports: { default: React.ElementType } }>
) {
  const peerComponents: Record<string, React.ElementType> = {}

  if (!entity?.data?.peerComponents) return peerComponents

  entity.data.peerComponents.forEach((name) => {
    const component = components[name]
    if (!component) {
      console.warn(
        `${
          entity.data.componentName ?? entity.data.name
        } lists ${name} as a peerComponent but <${name} /> is not in scope`
      )
    } else {
      peerComponents[name] = component.exports.default
    }
  })

  return peerComponents
}
