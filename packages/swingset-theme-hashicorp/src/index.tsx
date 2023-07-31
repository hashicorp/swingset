/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// NOTE: global css import needs to be at the top so component-specific CSS is loaded after the theme reset (component-specific CSS is loaded as a result of the swingset/meta import below)
import '../style.css'
import React from 'react'
import { AppWrapper } from './components/app-wrapper'
import { NavBar } from './components/nav-bar'
import { meta } from 'swingset/meta'
import Page from './page'

export default function SwingsetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="ss-h-full">
      <body className="ss-overflow-hidden">
        <NavBar />
        <AppWrapper>{children}</AppWrapper>
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
