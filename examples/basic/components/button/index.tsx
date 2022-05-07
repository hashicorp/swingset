import s from './style.module.css'

export default function Button({
  text,
  testObject,
  theme,
}: {
  text: string
  testObject: Record<string, any>
  theme: any
}) {
  return (
    <button className={s.root}>
      {text}, {JSON.stringify(testObject)}
    </button>
  )
}

export function ButtonSecondary({ text }: { text: string }) {
  return <button className={s.root}>{text}, secondary</button>
}

export const foo = 'bar'
