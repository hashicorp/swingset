import {
  ComponentEntity,
  DocsEntity,
  ComponentNode,
  CategoryNode,
} from './types.js'

export function getNavigationTree(entities: (ComponentEntity | DocsEntity)[]) {
  const componentEntities = entities.filter(
    (entity) => entity.__type === 'component'
  ) as ComponentEntity[]

  const componentEntitiesWithChildren = componentEntities.map(
    (componentEntity) => {
      if (componentEntity.isNested) return componentEntity

      componentEntity.children = componentEntities.filter(
        (childEntity) =>
          childEntity.isNested &&
          childEntity.componentPath === componentEntity.componentPath
      )

      return componentEntity
    }
  )

  //TODO: Account for duplicate folder names [category]/[folder]
  const categories = new Map<CategoryNode['title'], CategoryNode>()

  // bucket components into categories, nested documents are categorized under their component's path
  for (const entity of componentEntitiesWithChildren) {
    if (entity.isNested) continue

    const entityData: ComponentNode = {
      __type: 'component',
      title: entity.title,
      slug: entity.slug,
      componentPath: entity.componentPath,
      children: entity.children,
    }

    const categoryTitle = entity.navigationData?.category || 'default'
    const folderTitle = entity.navigationData?.folder
    const hasFolder = !!folderTitle

    const storedCategory =
      categories.has(categoryTitle) && categories.get(categoryTitle)

    if (!!storedCategory) {
      if (hasFolder) {
        storedCategory.children.forEach((child) => {
          const correctFolder =
            child.__type === 'folder' && child.title === folderTitle

          if (correctFolder) {
            child.children.push(entityData)
          }
        })
      } else {
        storedCategory.children.push(entityData)
      }
    } else {
      if (hasFolder) {
        categories.set(categoryTitle, {
          type: 'category',
          title: categoryTitle,
          children: [
            {
              __type: 'folder',
              title: folderTitle,
              parentCategory: categoryTitle,
              children: [entityData],
            },
          ],
        })
      } else {
        categories.set(categoryTitle, {
          type: 'category',
          title: categoryTitle,
          children: [entityData],
        })
      }
    }
  }

  const tree = Object.fromEntries(categories)
  return tree
}
