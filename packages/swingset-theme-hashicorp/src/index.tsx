// NOTE: global css import needs to be at the top so component-specific CSS is loaded after the theme reset (component-specific CSS is loaded as a result of the swingset/meta import below)
import '../style.css'

import React from 'react'
import Link from 'next/link'
import { meta, categories } from 'swingset/meta'
import { SideNavigation } from './components/side-nav'

import Page from './page'

export default function SwingsetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="ss-h-full">
      <body className="ss-h-full flex flex-col">
        <aside className="ss-hidden lg:ss-fixed lg:ss-inset-y-0 lg:ss-z-50 lg:ss-flex lg:ss-w-72 lg:ss-flex-col">
          <div className="ss-flex ss-grow ss-flex-col ss-gap-y-5 ss-overflow-y-auto ss-border-r ss-border-faint ss-bg-surface-faint ss-px-6 ss-py-10">
            <div className="ss-flex ss-shrink-0 ss-items-center">
              <Link
                href="/swingset"
                className="ss-tracking-widest ss-text-sm ss-uppercase ss-font-bold"
              >
                Swingset
              </Link>
            </div>
            <SideNavigation categories={categories} />
          </div>
        </aside>
        <main className="ss-py-10 lg:ss-pl-72 ss-flex ss-flex-col ss-flex-grow ss-h-full">
          <div className="ss-px-4 sm:ss-px-6 lg:ss-px-8 ss-flex ss-flex-col ss-flex-grow">
            {children}
          </div>
        </main>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__SWINGSET_META=${JSON.stringify(meta)};`,
          }}
        ></script>
      </body>
    </html>
  )
}

export { Page }
