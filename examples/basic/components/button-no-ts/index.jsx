import s from './style.module.css'

export default function ButtonNoTs({ text, testObject, theme }) {
  return (
    <button className={s.root}>
      {text}, {JSON.stringify(testObject)}
    </button>
  )
}
