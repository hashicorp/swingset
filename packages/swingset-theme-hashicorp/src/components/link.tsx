import { type ComponentProps } from 'react'
import NextLink from 'next/link'
import { cx } from 'class-variance-authority'

type NextLinkProps = ComponentProps<typeof NextLink>

export type LinkProps = NextLinkProps & { className?: string }

export function Link({ className, ...restProps }: LinkProps) {
  return (
    <NextLink
      className={cx('ss-text-blue-500 ss-underline', className)}
      {...restProps}
    />
  )
}
