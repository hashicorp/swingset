import { NextParsedUrlQuery } from 'next/dist/server/request-meta'
import { ComponentData, FormattedFileEntry } from '../types'
import { components, docs } from '../__swingset_data'

export function findEntity(
  params: NextParsedUrlQuery
): ComponentData | FormattedFileEntry {
  const [sourceType, slug] = params.swingset ?? []

  const entities =
    sourceType === 'components' ? components : sourceType === 'docs' ? docs : {}

  return Object.values(entities).find((entity) => {
    return entity.slug === slug
  })
}
