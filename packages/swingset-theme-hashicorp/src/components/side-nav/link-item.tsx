/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Link } from '../link'
import { cx } from 'class-variance-authority'

type LinkItemProps = {
  title: string
  to: string
}

function LinkItem({ title, to }: LinkItemProps) {
  return (
    <Link
      className={cx(
        'ss-text-primary hover:ss-text-action hover:ss-bg-surface-action',
        'ss-group ss-flex ss-gap-x-3 ss-rounded-md ss-p-2 ss-text-sm ss-leading-6 ss-no-underline'
      )}
      href={`swingset/${to}`}
    >
      {title}
    </Link>
  )
}

export { LinkItem }
