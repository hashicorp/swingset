import { NavigationTree } from 'swingset/types'
import Category from './category'

type SideNavBarProps = {
  categories: NavigationTree
}

function SideNavigation(props: SideNavBarProps) {
  const { categories } = props

  

  const categoriesJSX = Object.values(categories).map(
    (category) => (
      <Category title={category.title} key={category.title} items={category.children} />
    )
  )

  return <nav>{categoriesJSX}</nav>
}

export { SideNavigation }
