/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { NavigationTree } from 'swingset/types'
import Category from './category'
import { Link } from '../link'
import { cx } from 'class-variance-authority'
import { ToggleButton } from './toggle-button'

type SideNavBarProps = {
  categories: NavigationTree
  isOpen: boolean
  toggle: () => void
}

function SideNavigation({ categories, isOpen, toggle }: SideNavBarProps) {
  const renderedCategories = categories.map((category) => (
    <Category
      title={category.title}
      key={category.title}
      items={category.children}
    />
  ))

  return (
    <>
      <aside
        aria-hidden={!isOpen}
        className={cx(
          'ss-hidden lg:ss-z-50 lg:ss-flex lg:ss-flex-col ss-w-1/5 ss-max-w-md ss-transition-transform ss-m-0 ss-h-full ss-fixed',
          !isOpen && 'ss--translate-x-[85%]'
        )}
      >
        <ToggleButton isOpen={isOpen} toggle={toggle} />
        <nav className="ss-flex ss-grow ss-flex-col ss-gap-y-5 ss-overflow-y-auto ss-border-r ss-border-r-faint ss-py-10">
          {isOpen && renderedCategories}
        </nav>
      </aside>
    </>
  )
}

export { SideNavigation }
