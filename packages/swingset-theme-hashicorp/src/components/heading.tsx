import { type HTMLAttributes } from 'react'
import { cx, cva } from 'class-variance-authority'

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const headingStyles = cva('m-0 p0', {
  variants: {
    as: {
      h1: 'ss-text-3xl',
      h2: 'ss-text-2xl',
      h3: 'ss-text-xl',
      h4: 'ss-text-lg',
      h5: 'ss-text-md',
      h6: 'ss-text-md',
    },
  },
  defaultVariants: {
    as: 'h2',
  },
})

export function Heading({ as = 'h2', className, ...restProps }: HeadingProps) {
  const Component = as
  return <Component className={headingStyles({ as })} {...restProps} />
}
