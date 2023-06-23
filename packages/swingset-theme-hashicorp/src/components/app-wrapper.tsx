'use client'
import { SideNavigation } from './side-nav'
import { categories } from 'swingset/meta'
import { useState, ReactNode } from 'react'
import { cx } from 'class-variance-authority'

export function AppWrapper({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const toggle = () => setIsOpen((curr) => !curr)

  return (
    <>
      <SideNavigation categories={categories} isOpen={isOpen} toggle={toggle} />
      <main
        className={cx(
          'ss-py-10 ss-flex ss-flex-col ss-flex-grow ss-h-full ss-transition-all ss-px-4 sm:ss-m-0',
          isOpen && 'lg:ss-mx-64 xl:ss-mx-72 2xl:ss-mx-[460px]'
        )}
      >
        <div className="ss-flex ss-flex-col ss-flex-grow md:ss-px-8">
          {children}
        </div>
      </main>
    </>
  )
}
