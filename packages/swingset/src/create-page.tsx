/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
// note: this uses swingset/meta as the import statement, instead of a relative path, so the application build step can pick this up
import { getEntity } from 'swingset/meta'
import { RenderDocs } from './render'

type SwingsetPageProps = {
  params: { path: string[] }
}

export function createPage(ChildPage: React.ComponentType) {
  return function SwingsetPage(
    props: React.ComponentProps<typeof ChildPage> & SwingsetPageProps
  ) {
    const { params } = props
    const slug = params.path.join('/')

    const entity = getEntity(slug)

    return (
      <ChildPage
        data={entity}
        {...props}
        // @ts-expect-error -- Server components
        content={<RenderDocs data={entity} />}
      />
    )
  }
}
