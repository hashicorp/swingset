import { ComponentEntity, DocsEntity } from './types.js'

export function getNavigationTree(entities: (ComponentEntity | DocsEntity)[]) {
  let result: Record<
    string,
    Pick<ComponentEntity, 'title' | 'slug' | 'componentPath' | 'children'>[]
  > = {}

  const componentEntities = entities.filter(
    (entity) => entity.__type === 'component'
  ) as ComponentEntity[]

  const componentEntitiesWithChildren = componentEntities.map((entity) => {
    if (entity.isNested) return entity

    entity.children = componentEntities.filter(
      (childEntity) =>
        childEntity.isNested &&
        childEntity.componentPath === entity.componentPath
    )

    return entity
  })

  // bucket components into categories, nested documents are categorized under their component's path
  for (const entity of componentEntitiesWithChildren) {
    if (entity.isNested) continue

    result[entity.category] ||= []

    result[entity.category].push({
      title: entity.title,
      slug: entity.slug,
      componentPath: entity.componentPath,
      children: entity.children,
    })

    result[entity.category].sort((a, b) => (a.slug > b.slug ? 1 : -1))
  }

  return result
}
