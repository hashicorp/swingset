import { IconBottom24 } from '@hashicorp/flight-icons/svg-react/bottom-24'
import { cx } from 'class-variance-authority'

type ToggleButtonProps = {
  toggle: () => void
  isOpen: boolean
}

export function ToggleButton({ toggle, isOpen }: ToggleButtonProps) {
  const ariaLabel = isOpen
    ? 'Collapse navigation menu'
    : 'Expand navigation menu'

  return (
    <button
      aria-label={ariaLabel}
      className={cx(
        'ss-hidden ss-absolute lg:ss-block hover:ss-text-action ss-ml-1 ss-p-1 ss-transition-all ss-top-3 ss-right-3',
        !isOpen && 'ss--rotate-90',
        isOpen && 'ss-rotate-90'
      )}
      onClick={toggle}
    >
      <IconBottom24 />
    </button>
  )
}
