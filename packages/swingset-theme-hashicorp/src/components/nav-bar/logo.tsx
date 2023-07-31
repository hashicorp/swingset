/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconHashicorp24 } from '@hashicorp/flight-icons/svg-react'

function Logo() {
  return (
    <section className="ss-flex ss-items-center ss-gap-4">
      <picture className="ss-border-2 ss-h-full ss-p-2 ss-border-faint ss-rounded-lg">
        <IconHashicorp24 />
      </picture>
      <div>
        <p className="ss-font-semibold ss-text-dark ss-my-0 ss-text-sm">
          HashiCorp
        </p>
        <p className="ss-font-extralight ss-leading-4 ss-my-0 ss-text-sm">
          Web Presence
        </p>
      </div>
    </section>
  )
}

export { Logo }
