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

    let storedCategory =
      categories.has(categoryTitle) && categories.get(categoryTitle)!

    //if category doesnt exist, create it
    if (storedCategory === false) {
      categories.set(categoryTitle, {
        type: 'category',
        title: categoryTitle,
        children: [],
      })
      storedCategory = categories.get(categoryTitle)!
    }

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
        children: [entityData],
      })
      continue
    }

    //if node belongs in a folder, and folder already exists, add node to folder
    if (hasFolder && !!folder) {
      folder.children ||= []
      folder.children.push(entity)
      continue
    }

    //if node doesnt belong in folder, add node
    storedCategory.children.push(entityData)
  }

  const tree = Object.fromEntries(categories)
  return tree
}
