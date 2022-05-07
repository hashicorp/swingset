import s from './style.module.css'

export default function Button({
  text,
  testObject,
}: {
  text: string
  testObject: Record<string, any>
}) {
  return (
    <button className={s.root}>
      {text}, {JSON.stringify(testObject)}
    </button>
  )
}
