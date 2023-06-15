import { ComponentEntity, DocsEntity, NavigationTree, FolderNode, ComponentNode, NavigationNode } from './types.js'

export function getNavigationTree(entities: (ComponentEntity | DocsEntity)[]) {
  const tree: NavigationTree = {}

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

    tree[category] ||= []

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
      tree[category].push(entityData)
    }

  }

  folders.forEach((folder) => {
    tree[folder.parentCategory].push(folder)
  })

  const sortedTree = sortNavigationTree(tree);
  
  return sortedTree
}



const compareTitleSort = (a: any, b: any) => {
  if (a.title > b.title) return 1
  return -1
}


function sortNavigationTree(tree: NavigationTree) {
  const sortedByCategories = Object.keys(tree)
    .sort()
    .reduce<NavigationTree>((acc, category) => {
      acc[category] = tree[category]
      return acc
    }, {})

    function sortInPlace(toSort: NavigationTree[string] | NavigationTree[string][number]) {
      
      const isRoot = 'length' in toSort
    
      isRoot ? toSort as NavigationTree[string] : toSort as NavigationTree[string][number]
    
      if (isRoot) {
        (toSort as NavigationTree[string]).sort(compareTitleSort)
      }
    
      for (const node of (toSort as NavigationTree[string])) {
       
        const hasChildren = 'children' in node && node.children!.length > 0;
      
    
        if (hasChildren) {
          sortInPlace(node.children! as unknown as NavigationNode)
        }
      }
    
    
    }

  Object.values(sortedByCategories).forEach((categoryContents) =>  sortInPlace(categoryContents))

  
  return sortedByCategories
}