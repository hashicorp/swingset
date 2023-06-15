import React from 'react'

export type SwingsetPageProps = {
  params: { path: string[] }
}

export interface Entity {
  __type: any
  filepath: string
  frontmatter: Record<string, unknown>
  load: string
  normalizedPath: string
  relativePath: string
  slug: string
}

// TODO: support subpaths? e.g. components/button/docs/accessibility.mdx
export interface ComponentEntity extends Entity {
  __type: 'component'
  category: string
  componentPath: string
  title: string
  isNested?: boolean
  children?: ComponentEntity[]
  navigationData?: {
    category: string
    folder?: string
    page: string
  }
}

export interface DocsEntity extends Entity {
  __type: 'doc'
}

/**
 * This helper type is used to provide a type for the load function, which is passed around internally as a string and returned from the loader.
 */
export type EvaluatedEntity<T extends Entity = ComponentEntity | DocsEntity> =
  T & {
    load: () => Promise<React.ElementType>
  }

/* 
Utility type to extract just necessary properties before going to theme, also renames '__type' key to type for external usage.
Unwanted Behavior?? The children property comes through as a ComponentEntity, which exposes the entities to the theme/clients 
*/
export type ComponentNode = Omit<
  Pick<
    ComponentEntity,
    '__type' | 'title' | 'slug' | 'componentPath' | 'children'
  >,
  '__type'
> & { type: ComponentEntity['__type'] }

export type FolderNode = {
  type: 'folder'
  title: string
  parentCategory: string
  children: ComponentNode[]
}

export type NavigationNode = ComponentNode | FolderNode

export type CategoryNode = {
  type: 'category'
  title: string
  children: NavigationNode[]
}



export type NavigationTree = CategoryNode[]
