import React from 'react'
import Link from 'next/link'
// note: this uses swingset/meta as the import statement, instead of a relative path, so the application build step can pick this up
import { meta, categories } from 'swingset/meta'

import Page from './page'

export default function SwingsetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="ss-h-full">
      <body className="ss-h-full">
        <div className="ss-h-full ss-max-w-7xl ss-my-0 ss-mx-auto">
          <aside className="ss-fixed ss-top-0 ss-bottom-0 ss-z-0">
            <div className="ss-pt-10">
              <span className="ss-text-lg ss-font-bold">Swingset</span>
              <nav>
                <ul>
                  {Object.entries(categories).map(([title, items]) => (
                    <>
                      <li>
                        <h3 className="ss-my-2 ss-text-gray-600">{title}</h3>
                      </li>
                      {/**
                       * TODO: Rewrite this for the new 
                       * https://github.com/hashicorp/swingset/pull/105
                       * @type {NavigationTree}
                       * Leaving ts ignore to ensure build step succeeds
                       * @ts-ignore   */}
                      {(items as string[]).map((slug: string) => (
                        <li>
                          <Link href={`/swingset/${slug}`}>{slug}</Link>
                        </li>
                      ))}
                    </>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
          <main className="ss-ml-72 ss-pt-10">{children}</main>
        </div>
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
