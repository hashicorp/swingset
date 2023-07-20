'use client'
import { SideNavigation } from './side-nav'
import { categories } from 'swingset/meta'
import { useState, ReactNode } from 'react'
import { cx } from 'class-variance-authority'

export function AppWrapper({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const toggle = () => setIsOpen((curr) => !curr)

  return (
    <div className="ss-h-[100vh] ss-w-full">
      <SideNavigation categories={categories} isOpen={isOpen} toggle={toggle} />
      <main className="ss-h-full ss-w-full ss-overflow-auto ss-m-auto">
        <div
          className={cx(
            'ss-flex ss-flex-col ss-flex-grow ss-m-auto ss-max-w-5xl ss-mb-24 ss-transition-all',
            isOpen ? 'ss-w-1/2' : 'ss-w-2/3'
          )}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
