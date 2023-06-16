import {
  ComponentEntity,
  DocsEntity,
  ComponentNode,
  CategoryNode,
  NavigationTree,
} from './types.js'

export function getNavigationTree(
  entities: (ComponentEntity | DocsEntity)[]
): NavigationTree {
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

    const componentNode: ComponentNode = {
      __type: 'component',
      title: entity.title,
      slug: entity.slug,
      componentPath: entity.componentPath,
      children: entity.children,
    }

    const categoryTitle = entity.navigationData?.category || 'default'

    const hasCategory = categories.has(categoryTitle)

    //if category doesnt exist, create it
    const storedCategory = hasCategory
      ? categories.get(categoryTitle)!
      : categories.set(categoryTitle, {
          type: 'category',
          title: categoryTitle,
          children: [],
        }) && categories.get(categoryTitle)!

    const folderTitle = entity.navigationData?.folder
    const hasFolder = !!folderTitle
    const folder = storedCategory.children.find(
      (node) => node.title === folderTitle
    )

    //if node belongs in a folder, and folder doesnt exist, create folder with node
    if (hasFolder && !!folder === false) {
      storedCategory.children.push({
        __type: 'folder',
        title: folderTitle,
        parentCategory: categoryTitle,
        children: [componentNode],
      })
      continue
    }

    //if node belongs in a folder, and folder already exists, add node to folder
    if (hasFolder && !!folder) {
      folder.children ||= []
      /**TODO:
       *  We should be pushing @type {ComponentNode} instead of @type {ComponentEntity}
       *  https://github.com/hashicorp/swingset/issues/107
       */
      folder.children.push(entity)
      continue
    }

    //if node doesnt belong in folder, add node
    storedCategory.children.push(componentNode)
  }

  const tree = Array.from(categories.values())
  return tree
}
