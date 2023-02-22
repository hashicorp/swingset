interface NestedObject {
  foo: {
    /**
     * I am a description
     */
    bar: string
  }
}

interface Props {
  /**
   * nested is a NestedObject
   */
  nested: NestedObject
  /** I am optional */
  baz?: string
  alpha: string[]
  beta: [string, number]
}

export default function Component({ nested, baz = 'baz' }: Props) {
  return <div />
}
