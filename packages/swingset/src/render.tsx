/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// note: this uses swingset/meta as the import statement, instead of a relative path, so the application build step can pick this up
import { getEntity } from 'swingset/meta'
import { type Entity, type EvaluatedEntity } from './types'

interface RenderDocsProps<T extends Entity> {
  slug?: string
  data?: EvaluatedEntity<T>
}

export async function RenderDocs({ data, slug }: RenderDocsProps<Entity>) {
  let entity = data

  if (!entity && slug) {
     entity = getEntity(slug)
  }

  if (entity) {
    const Content = await entity.load()

    return <Content />
  }

  return null
}
