import { describe, it } from 'vitest'
import { getNavigationTree } from '../src/get-nav-tree'
import { ComponentNode, ComponentEntity, NavigationTree } from '../src/types'

describe(getNavigationTree.name, () => {
  it('Builds the Navigation Tree', ({ expect }) => {
    const input: ComponentEntity[] = [
      {
        __type: 'component',
        category: 'default',
        componentPath: '../../..',
        filepath: '../../..',
        frontmatter: {},
        normalizedPath: '',
        relativePath: '',
        slug: '',
        title: '',
        load: '',
      },
    ]

    const expectation: NavigationTree = [
      {
        children: [
          {
            __type: 'component',
            componentPath: '../../..',
            slug: '',
            title: '',
          },
        ],
        title: 'default',
        type: 'category',
      },
    ]

    const result = getNavigationTree(input)

    expect(result).toEqual(expectation)
  })
  it('Supports duplicate entities', ({ expect }) => {
    const input: ComponentEntity[] = [
      {
        __type: 'component',
        category: 'default',
        componentPath: '../../..',
        filepath: '../../..',
        frontmatter: {},
        normalizedPath: '',
        relativePath: '',
        slug: '',
        title: '',
        load: '',
      },
      {
        __type: 'component',
        category: 'default',
        componentPath: '../../..',
        filepath: '../../..',
        frontmatter: {},
        normalizedPath: '',
        relativePath: '',
        slug: '',
        title: '',
        load: '',
      },
    ]

    const expectation: NavigationTree = [
      {
        children: [
          {
            __type: 'component',
            componentPath: '../../..',
            slug: '',
            title: '',
          },
          {
            __type: 'component',
            componentPath: '../../..',
            slug: '',
            title: '',
          },
        ],
        title: 'default',
        type: 'category',
      },
    ]

    const result = getNavigationTree(input)

    expect(result).toEqual(expectation)
  })
  it('Returns an empty array if it receives one', ({ expect }) => {
    const input: ComponentEntity[] = []
    const expectation: NavigationTree = []
    const result = getNavigationTree(input)

    expect(result).toEqual(expectation)
  })
})
