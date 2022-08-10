function Aside({
  className,
  children,
  type = 'info',
}: {
  /** Optional className to add to the root element. */
  className?: string
  /** Children to render into the Alert block. */
  children: React.ReactNode
  /** The type of message being displayed, which mainly affects coloration. Defaults to "info". */
  type?: 'info' | 'success' | 'warning' | 'danger'
}) {
  return <div />
}

export default Aside
