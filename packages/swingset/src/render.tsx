// @ts-expect-error -- this should be resolved once the theme is externalized
import { getEntity } from 'swingset/meta'
import { type Entity } from './types'

interface RenderDocsProps {
  component?: string
  data?: Entity
}

export async function RenderDocs({ data, component }: RenderDocsProps) {
  const entity = data ?? getEntity(component)

  if (entity) {
    const Content = await entity.load()

    return <Content />
  }

  return null
}
