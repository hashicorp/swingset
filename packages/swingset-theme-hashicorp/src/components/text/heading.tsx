/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { cva, VariantProps, cx } from 'class-variance-authority'
import { type HTMLAttributes } from 'react'

const styles = cva(
  'ss-m-0 ss-p-0 ss-font-bold ss-leading-normal ss-text-dark',
  {
    variants: {
      as: {
        h1: 'ss-text-6xl ss-tracking-tight',
        h2: 'ss-text-4xl',
        h3: 'ss-text-2xl',
        h4: 'ss-text-xl ss-font-extrabold',
        h5: 'ss-text-xl',
        h6: 'ss-text-lg',
      },
    },
    defaultVariants: {
      as: 'h3',
    },
  }
)

type HeadingProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof styles>

export function Heading({ as, children, className, ...props }: HeadingProps) {
  const Element = as ?? 'h3'

  return (
    <Element className={cx(styles({ as }), className)} {...props}>
      {children}
    </Element>
  )
}
