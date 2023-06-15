import { Link } from "../link"
import { cx } from "class-variance-authority"

function LinkItem({ title, to }: Record<'title' | 'to', string>) {
 return (
   <Link
     className={cx(
       'ss-text-foreground-primary hover:ss-text-foreground-action hover:ss-bg-surface-action',
       'ss-group ss-flex ss-gap-x-3 ss-rounded-md ss-p-2 ss-text-sm ss-leading-6 ss-no-underline'
     )}
     href={`swingset/${to}`}
   >
     {title}
   </Link>
 )
}

export {LinkItem}