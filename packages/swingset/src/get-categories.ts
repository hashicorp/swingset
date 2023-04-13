import { ComponentEntity, DocsEntity } from './types'

// TODO: sort
export function getCategories(entities: (ComponentEntity | DocsEntity)[]) {
  let result: Record<string, Pick<ComponentEntity, 'title' | 'slug'>[]> = {}

  for (const entity of entities.filter(
    (entity) => entity.__type === 'component'
  ) as ComponentEntity[]) {
    result[entity.category] ||= []

    result[entity.category].push({ title: entity.title, slug: entity.slug })
  }

  return result
}
