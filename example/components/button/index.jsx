import s from './style.module.css'

export default function Button({ text }) {
  return <button className={s.root}>{text}</button>
}
