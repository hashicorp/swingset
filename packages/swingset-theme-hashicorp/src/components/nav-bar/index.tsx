/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Logo } from './logo'
import Link from 'next/link'
import { IconGithub24 } from '@hashicorp/flight-icons/svg-react'

function NavBar() {
  return (
    <header className="ss-w-full ss-border-b-2 ss-border-faint">
      <nav>
        <ul className="ss-px-6 ss-p-2 ss-flex ss-items-center ss-w-full ss-justify-between">
          <li className="ss-flex-1">
            <Logo />
          </li>
          <li className="ss-flex-1 ss-text-center">
            <Link
              href={'/swingset'}
              className="ss-font-semibold ss-text-dark hover:ss-text-action"
            >
              About
            </Link>
          </li>

          <li className="ss-flex-1">
            <Link
              href={'https://github.com/hashicorp/swingset'}
              className="ss-font-semibold ss-text-dark hover:ss-text-action"
              target="_blank"
            >
              <IconGithub24 className="ss-ml-auto" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export { NavBar }
