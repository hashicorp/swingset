// @ts-expect-error -- this should be resolved once the theme is externalized
import { meta, categories } from 'swingset/meta'
import { Link } from './components/link'

import Page from './page'

import '../style.css'

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
              <span className="ss-text-lg ss-font-bold">
                <Link href="/swingset">Swingset</Link>
              </span>
              <nav>
                <ul>
                  {Object.entries(categories).map(([title, items]) => (
                    <>
                      <li>
                        <h3 className="ss-my-2 ss-text-gray-600">{title}</h3>
                      </li>
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
          <main className="ss-ml-72 ss-py-10">{children}</main>
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
