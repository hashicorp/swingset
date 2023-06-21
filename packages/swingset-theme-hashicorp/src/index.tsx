// NOTE: global css import needs to be at the top so component-specific CSS is loaded after the theme reset (component-specific CSS is loaded as a result of the swingset/meta import below)
import '../style.css'
import { cx } from 'class-variance-authority'
import React from 'react'
import Link from 'next/link'
import { App } from './app'


import Page from './page'

export default function SwingsetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="ss-h-full">
      <body className="ss-h-full flex flex-col">
        <App />
        <main className="ss-py-10 lg:ss-ml-72 ss-flex ss-flex-col ss-flex-grow ss-h-full">
          <div className="ss-px-4 sm:ss-px-6 lg:ss-px-8 ss-flex ss-flex-col ss-flex-grow">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}

export { Page }
