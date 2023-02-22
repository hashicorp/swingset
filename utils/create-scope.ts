/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import createLiveComponent from '../components/live-component'
import createKnobsComponent from '../components/knobs-component'
import PropsTable from '../components/props-table'
import { SwingsetOptions } from '../types'
import React from 'react'

export default function createScope(
  scope: Record<string, JSX.Element>,
  swingsetOptions: SwingsetOptions,
  peerComponents: Record<string, React.ElementType> = {}
) {
  const scopeWithCustomComponents = Object.assign(
    {},
    scope,
    swingsetOptions.components || {},
    peerComponents
  )

  return {
    ...scopeWithCustomComponents,
    LiveComponent: createLiveComponent(scopeWithCustomComponents),
    KnobsComponent: createKnobsComponent(scopeWithCustomComponents),
    PropsTable,
  }
}
