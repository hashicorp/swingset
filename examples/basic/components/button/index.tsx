import s from './style.module.css'

export interface Props {
  /** the text for the button */
  text: string
  testObject: {
    foo: {
      /** this is a nested thing */
      bar: string
    }
    baz: string[]
  }
  theme: any
}

export default function Button({ text, testObject, theme }: Props) {
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
