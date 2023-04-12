import { ComponentEntity, DocsEntity } from './types'

// TODO: sort
export function getCategories(entities: (ComponentEntity | DocsEntity)[]) {
  let result: Record<string, string[]> = {}

  for (const entity of entities.filter(
    (entity) => entity.__type === 'component'
  ) as ComponentEntity[]) {
    result[entity.category] ||= []

    result[entity.category].push(entity.slug)
  }

  return result
}
