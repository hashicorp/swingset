import { NavigationTree } from 'swingset/types'
import Category from './category'
//import { useState } from 'react'
import { Link } from '../link'

type SideNavBarProps = {
  categories: NavigationTree
}

function SideNavigation({ categories }: SideNavBarProps) {
  // const [isOpen, setIsOpen] = useState<boolean>(true);

  // const toggle = () => setIsOpen((curr) => !curr)

  const renderCategories = categories.map((category) => (
    <Category
      title={category.title}
      key={category.title}
      items={category.children}
    />
  ))

  return (
    <aside className="ss-hidden lg:ss-fixed lg:ss-inset-y-0 lg:ss-z-50 lg:ss-flex lg:ss-w-72 lg:ss-flex-col">
      <div className="ss-flex ss-grow ss-flex-col ss-gap-y-5 ss-overflow-y-auto ss-border-r ss-border-faint ss-bg-surface-faint ss-px-6 ss-py-10">
        <div className="ss-flex ss-shrink-0 ss-items-center">
          <Link
            href="/swingset"
            className="ss-tracking-widest ss-text-sm ss-uppercase ss-font-bold ss-no-underline"
          >
            Swingset
          </Link>
          <button >&#60;</button>
        </div>
        <nav>
          {renderCategories}
        </nav>
      </div>
    </aside>
  )
}

export { SideNavigation }

