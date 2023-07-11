'use client'
import {
  IconDuplicate16,
  IconFileCheck16,
} from '@hashicorp/flight-icons/svg-react'
import type { MouseEventHandler } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { cx } from 'class-variance-authority'

function CopyButton({ code }: { code: string }) {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) return
    const timerId = setTimeout(() => {
      setIsCopied(false)
    }, 2000)

    return () => {
      clearTimeout(timerId)
    }
  }, [isCopied])

  const handleClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(async () => {
    setIsCopied(true)
    if (!navigator?.clipboard) {
      console.error('Access to clipboard rejected!')
    }
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      console.error('Failed to copy!')
    }
  }, [code])

  const Icon = isCopied ? IconFileCheck16 : IconDuplicate16

  return (
    <button
      className={cx(
        'ss-top-3 ss-absolute ss-right-4 ss-text-gray-200 ss-cursor-pointer hover:ss-backdrop-brightness-150  ss-border-[1px] ss-border-gray-200 ss-p-1 ss-rounded-md active:ss-backdrop-brightness-50 active:ss-scale-90',
        isCopied &&
          'ss-text-green-400 ss-border-green-400 hover:ss-text-green-400'
      )}
      onClick={handleClick}
    >
      <Icon />
    </button>
  )
}

export { CopyButton }
