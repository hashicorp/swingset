import { IconChevronLeft24 } from '@hashicorp/flight-icons/svg-react/chevron-left-24'
import { cx } from 'class-variance-authority'

type ToggleButtonProps = {
  toggle: () => void
  isOpen: boolean
}

export function ToggleButton({ toggle, isOpen }: ToggleButtonProps) {
  return (
    <button
      className={cx(
        'ss-bg-surface-faint hover:ss-bg-surface-action hover:ss-text-foreground-action ss-border-2 ss-border-faint hover:ss-border-action ss-p-1 ss-rounded-full ss-transition-transform ss-shadow-md ss-fixed ss-top-6 ss-left-72',
        !isOpen && 'ss--translate-x-72'
      )}
      onClick={toggle}
    >
      <IconChevronLeft24 className={cx(!isOpen && 'ss--rotate-180')} />
    </button>
  )
}
