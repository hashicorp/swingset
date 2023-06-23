import { IconChevronRight24 } from '@hashicorp/flight-icons/svg-react/chevron-right-24'
import { cx } from 'class-variance-authority'

type ToggleButtonProps = {
 toggle: () => void
 isOpen: boolean
}

export function ToggleButton({ toggle, isOpen }: ToggleButtonProps) {
 return (
  <button className="ss-fixed ss-left-72 ss-p-2 ss-top-6" onClick={toggle}>
   <div
    className={cx(
     'ss-bg-surface-faint ss-border-faint ss-border-2 ss-rounded-full ss-transition-transform ss-shadow-md ss-p-1 ss-bg-opacity-60 ss-backdrop-blur-sm',
     !isOpen && 'ss--rotate-180'
    )}
   >
    <IconChevronRight24 />
   </div>
  </button>
 )
}
