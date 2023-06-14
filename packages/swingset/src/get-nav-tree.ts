import { ComponentEntity, DocsEntity, NavigationTree, FolderNode, ComponentNode } from './types.js'

export function getNavigationTree(entities: (ComponentEntity | DocsEntity)[]) {
  const result: NavigationTree = {}

  const componentEntities = entities.filter(
    (entity) => entity.__type === 'component'
  ) as ComponentEntity[]

  const componentEntitiesWithChildren = componentEntities.map((componentEntity) => {
    if (componentEntity.isNested) return componentEntity

    componentEntity.children = componentEntities.filter(
      (childEntity) =>
        childEntity.isNested &&
        childEntity.componentPath === componentEntity.componentPath
    )

    return componentEntity
  })
  

  //TODO: Account for duplicate folder names [category]/[folder]
  const folders = new Map<FolderNode['title'], FolderNode>()

  // bucket components into categories, nested documents are categorized under their component's path
  for (const entity of componentEntitiesWithChildren) {
    if (entity.isNested) continue

    const entityData: ComponentNode = {
      type: 'component',
      title: entity.title,
      slug: entity.slug,
      componentPath: entity.componentPath,
      children: entity.children,
    }

    //TODO: Handle Default Category
    const category = entity.navigationData?.category!
    const folder = entity.navigationData?.folder

    result[category] ||= []

    if (folder) {
      if (folders.has(folder)) {
        const storedFolder = folders.get(folder)

        storedFolder?.children.push(entityData)
      } else {
        folders.set(folder, {
          type: 'folder',
          title: folder,
          parentCategory: category,
          children: [entityData],
        })
      }
    } else {
      result[category].push(entityData)
    }

  }
  //TODO: Sort Categories Alphbetically before returning -> see original
  folders.forEach((folder) => {
    result[folder.parentCategory].push(folder)
  })

  return result
}

/*
ORIGINAL FUNC - keeping to reference sort
=================




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

    //TODO: Handle Default Category
    const category = entity.navigationData?.category!



    result[category] ||= []


  
    result[category].push({
      title: entity.title,
      slug: entity.slug,
      componentPath: entity.componentPath,
      children: entity.children,
    })

    result[category].sort((a, b) => (a.slug > b.slug ? 1 : -1))
  }
  console.log(result)
  return result
}
*/