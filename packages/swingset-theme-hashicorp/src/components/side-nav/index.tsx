import { NavigationTree } from 'swingset/types'
import Category from './category'
//import { useState } from 'react'
import { Link } from '../link'
import { cx } from 'class-variance-authority'
import { ToggleButton } from './toggle-button'

type SideNavBarProps = {
  categories: NavigationTree
  isOpen: boolean
  toggle: () => void
}

function SideNavigation({ categories, isOpen, toggle }: SideNavBarProps) {
  const renderCategories = categories.map((category) => (
    <Category
      title={category.title}
      key={category.title}
      items={category.children}
    />
  ))

  return (
    <aside
      className={cx(
        'ss-hidden lg:ss-fixed lg:ss-inset-y-0 lg:ss-z-50 lg:ss-flex lg:ss-flex-col lg:ss-w-72 ss-transition-transform',
        !isOpen && 'ss--translate-x-full'
      )}
    >
      <div className="ss-flex ss-grow ss-flex-col ss-gap-y-5 ss-overflow-y-auto ss-border-r ss-border-faint ss-bg-surface-faint ss-px-6 ss-py-10">
        <div className="ss-flex ss-shrink-0 ss-items-center">
          <Link
            href="/swingset"
            className="ss-tracking-widest ss-text-sm ss-uppercase ss-font-bold ss-no-underline ss-text-foreground-faint ss-transition-colors hover:ss-text-foreground-action"
          >
            Swingset
          </Link>
        </div>
        <ToggleButton isOpen={isOpen} toggle={toggle} />
        <nav>{renderCategories}</nav>
      </div>
    </aside>
  )
}

export { SideNavigation }

