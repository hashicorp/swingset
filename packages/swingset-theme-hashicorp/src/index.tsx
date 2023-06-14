// NOTE: global css import needs to be at the top so component-specific CSS is loaded after the theme reset (component-specific CSS is loaded as a result of the swingset/meta import below)
'use client'
import '../style.css'

import React from 'react'
import Link from 'next/link'
import { meta, categories, categories__NEW } from 'swingset/meta'
import { cx } from 'class-variance-authority'

import Page from './page'

function NavList({ items, level }: any) {
  const isNested = level > 0

  return (
    <ul
      role="list"
      className={cx(
        'ss-mt-2 ss-space-y-1',
        isNested && 'ss-ml-2 ss-border-l ss-border-faint ss-mt-0'
      )}
    >
      {items.map(({ title, slug, children }: any) => (
        <li key={slug}>
          <Link
            href={`/swingset/${slug}`}
            className={cx(
              'ss-text-foreground-primary hover:ss-text-foreground-action hover:ss-bg-surface-action',
              'ss-group ss-flex ss-gap-x-3 ss-rounded-md ss-p-2 ss-text-sm ss-leading-6'
            )}
          >
            {title}
          </Link>
          {children && <NavList level={level + 1} items={children} />}
        </li>
      ))}
    </ul>
  )
}

export default function SwingsetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log(categories)
  console.log(categories__NEW)
  return (
    <html lang="en" className="ss-h-full">
      <body className="ss-h-full flex flex-col">
        <div className="ss-hidden lg:ss-fixed lg:ss-inset-y-0 lg:ss-z-50 lg:ss-flex lg:ss-w-72 lg:ss-flex-col">
          <div className="ss-flex ss-grow ss-flex-col ss-gap-y-5 ss-overflow-y-auto ss-border-r ss-border-faint ss-bg-surface-faint ss-px-6 ss-py-10">
            <div className="ss-flex ss-shrink-0 ss-items-center">
              <Link
                href="/swingset"
                className="ss-tracking-widest ss-text-sm ss-uppercase ss-font-bold"
              >
                Swingset
              </Link>
            </div>
            <nav className="ss-flex ss-flex-1 ss-flex-col">
              <ul
                role="list"
                className="ss-flex ss-flex-1 ss-flex-col ss-gap-y-7"
              >
                {Object.entries(categories).map(([title, items]) => (
                  <>
                    <li>
                      <h3 className="ss-uppercase ss-text-xs ss-font-semibold ss-leading-6 ss-text-foreground-faint ss-border-b ss-border-faint ss-pb-2">
                        {title}
                      </h3>
                      <NavList items={items} level={0} />
                    </li>
                  </>
                ))}
              </ul>
            </nav>
          </div>
        </div>
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
