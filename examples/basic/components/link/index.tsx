import s from './style.module.css'

export interface Props {
  text: string
  href: string
}

export default function Link({ text, href }: Props) {
  return (
    <a className={s.root} href={href}>
      {text}
    </a>
  )
}
