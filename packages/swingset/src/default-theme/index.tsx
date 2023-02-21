import Link from 'next/link'
// @ts-expect-error -- this should be resolved once the theme is externalized
import data from 'swingset/meta'

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
                  {Object.entries(data).map(([, d]: [string, any]) => (
                    <li>
                      <Link href={`/swingset/${d.slug}`}>{d.slug}</Link>&nbsp;
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
          <main className="ss-ml-72 ss-pt-10">{children}</main>
        </div>
      </body>
    </html>
  )
}

export { Page }
