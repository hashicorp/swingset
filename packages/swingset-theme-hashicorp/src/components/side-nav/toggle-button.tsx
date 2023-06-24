import { IconChevronLeft24 } from '@hashicorp/flight-icons/svg-react/chevron-left-24'
import { cx } from 'class-variance-authority'

type ToggleButtonProps = {
  toggle: () => void
  isOpen: boolean
}

export function ToggleButton({ toggle, isOpen }: ToggleButtonProps) {
  return (
    <button
      aria-label="Toggle the navigation menu between open and closed states"
      className={cx(
        'ss-bg-surface-faint ss-hidden lg:ss-block hover:ss-bg-surface-action ss-opacity-70 hover:ss-text-foreground-action ss-border-2 ss-border-faint hover:ss-border-action ss-p-1 ss-rounded-full hover:ss-shadow-lg ss-transition-all ss-shadow-sm ss-fixed ss-top-6 ss-left-72',
        !isOpen && 'ss--translate-x-[17rem]'
      )}
      onClick={toggle}
    >
      <IconChevronLeft24 className={cx(!isOpen && 'ss--rotate-180')} />
    </button>
  )
}
