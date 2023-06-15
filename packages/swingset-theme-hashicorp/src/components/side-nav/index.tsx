import { NavigationTree } from 'swingset/types'
import Category from './category'

type SideNavBarProps = {
  categories: NavigationTree
}

function SideNavigation(props: SideNavBarProps) {
  const { categories } = props

  const categoriesJSX = Object.entries(categories).map(
    ([category, entities]) => (
      <Category title={category} key={category} items={entities} />
    )
  )

  return <nav>{categoriesJSX}</nav>
}

export { SideNavigation }
