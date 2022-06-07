import s from './style.module.css'

export default function Knobs({
  text,
  href,
  openInNewWindow,
  theme,
}: {
  text: string
  href: string
  openInNewWindow?: boolean
  theme?: { color: string; backgroundColor: string }
}) {
  const additionalProps = openInNewWindow
    ? { target: '_blank', rel: 'noopener noorefer' }
    : {}
  return (
    <a
      className={s.root}
      href={href}
      {...additionalProps}
      style={{
        color: theme?.color,
        backgroundColor: theme?.backgroundColor,
      }}
    >
      {text}
    </a>
  )
}
