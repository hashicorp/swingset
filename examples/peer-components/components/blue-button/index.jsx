import s from './style.module.css'

export default function Button({ text, testObject }) {
  return (
    <button className={s.root}>
      {text}, {JSON.stringify(testObject)}
    </button>
  )
}
