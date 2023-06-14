import { ComponentEntity, DocsEntity } from './types.js'

type ComponentNavigation = Pick<
  ComponentEntity,
  'title' | 'slug' | 'componentPath' | 'children'
>

type Folder = {
  title: string
  parentCategory: string
  children: ComponentNavigation[]
}

type NavigationData = Record<
  string,
  {
    folders: Folder[]
    children: ComponentNavigation[]
  }
>

export function getNavigationTree__NEW(entities: (ComponentEntity | DocsEntity)[]) {
  const result: NavigationData = {}

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

  const folders = new Map<Folder['title'], Folder>()

  // bucket components into categories, nested documents are categorized under their component's path
  for (const entity of componentEntitiesWithChildren) {
    if (entity.isNested) continue

    const entityData = {
      title: entity.title,
      slug: entity.slug,
      componentPath: entity.componentPath,
      children: entity.children,
    }

    //TODO: Handle Default Category
    const category = entity.navigationData?.category!
    const folder = entity.navigationData?.folder

    result[category] ||= { folders: [], children: [] }

    if (folder) {
      if (folders.has(folder)) {
        const storedFolder = folders.get(folder)

        storedFolder?.children.push(entityData)
      } else {
        folders.set(folder, {
          title: folder,
          parentCategory: category,
          children: [entityData],
        })
      }
    } else {
      result[category].children.push(entityData)
    }

   

    // result[category].push({
    //   title: entity.title,
    //   slug: entity.slug,
    //   componentPath: entity.componentPath,
    //   children: entity.children,
    // })

    // result[category].sort((a, b) => (a.slug > b.slug ? 1 : -1))
  }

  folders.forEach((folder) => {
    result[folder.parentCategory].folders.push(folder)
  })

  return result
}

/*
ORIGINAL FUNC
=================
*/



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
