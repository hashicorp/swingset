import { NavigationTree } from 'swingset/types'
import Category from './category'

type SideNavBarProps = {
  categories: NavigationTree
}

function SideNavigation({ categories }: SideNavBarProps) {
  

  const renderCategories = categories.map(
    (category) => (
      <Category title={category.title} key={category.title} items={category.children} />
    )
  )

  return <nav>{renderCategories}</nav>
}

export { SideNavigation }
