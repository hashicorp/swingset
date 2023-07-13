import { cva, VariantProps, cx } from 'class-variance-authority'
import { type HTMLAttributes } from 'react'

const headingStyles = cva('ss-m-0 ss-p-0', {
  variants: {
    as: {
      h1: 'ss-text-5xl ss-tracking-tight ss-font-bold',
      h2: 'ss-text-2xl',
      h3: 'ss-text-xl',
      h4: 'ss-text-lg',
      h5: 'ss-text-md',
      h6: 'ss-text-md',
    },
  },
  defaultVariants: {
    as: 'h3',
  },
})

type HeadingProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingStyles>

export function Heading({ as, children, className, ...props }: HeadingProps) {
  const Element = as ?? 'h3'

  return (
    <Element className={cx(headingStyles({ as }), className)} {...props}>
      {children}
    </Element>
  )
}
