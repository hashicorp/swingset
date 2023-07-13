import { cva, VariantProps, cx } from 'class-variance-authority'
import { type HTMLAttributes } from 'react'

type HeadingProps = HTMLAttributes<HTMLHeadingElement>

export function Body({ children, className, ...props }: HeadingProps) {
  const defaultStyles =
    'ss-my-3 ss-p-0 ss-text-primary ss-text-base ss-font-normal'

  return (
    <p className={cx(defaultStyles, className)} {...props}>
      {children}
    </p>
  )
}
