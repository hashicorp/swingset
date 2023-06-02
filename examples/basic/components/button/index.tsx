import { ReactElement } from 'react'

interface ButtonProps {
  color?: string
  children: ReactElement
}

export function Button({ children }: ButtonProps) {
  return <button>{children}</button>
}
