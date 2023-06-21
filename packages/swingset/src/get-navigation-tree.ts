import {
  ComponentEntity,
  DocsEntity,
  ComponentNode,
  CategoryNode,
  NavigationTree,
  NavigationNode,
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

  const categories = new Map<CategoryNode['title'], CategoryNode>()

  // bucket components into categories, nested documents are categorized under their component's path
  for (const entity of componentEntitiesWithChildren) {
    if (entity.isNested) continue

    const componentNode: ComponentNode = {
      __type: 'component',
      title: entity.title,
      slug: entity.slug,
      componentPath: entity.componentPath,
    }

    const categoryTitle = entity.navigationData?.category || 'default'

    const hasCategory = categories.has(categoryTitle)

    if (!hasCategory) {
      categories.set(categoryTitle, {
        __type: 'category',
        title: categoryTitle,
        children: [],
      })
    }

    const storedCategory = categories.get(categoryTitle)!

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
    if (hasFolder && !!folder && folder.__type === 'folder') {
      folder.children ||= []
      folder.children.push(componentNode)
      continue
    }

    //if node doesnt belong in folder, add node
    storedCategory.children.push(componentNode)
  }

  const tree = Array.from(categories.values())

  deepSort(tree)

  return tree
}
/**
 *
 * Sorts tree alphabetically
 */
function deepSort(nodes: (CategoryNode | NavigationNode)[]) {
  nodes.sort(compareTitleSort)

  for (const node of nodes) {
    const hasChildren = 'children' in node

    if (hasChildren) {
      deepSort(node.children)
    }
  }
}

function compareTitleSort<T extends CategoryNode | NavigationNode>(
  a: T,
  b: T
): -1 | 0 | 1 {
  if (a.title > b.title) {
    return 1
  }
  if (b.title > a.title) {
    return -1
  }
  return 0
}
