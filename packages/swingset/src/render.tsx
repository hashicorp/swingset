import { getEntity } from './meta'
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
