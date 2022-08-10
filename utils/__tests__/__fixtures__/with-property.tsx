interface Props {
  text: string
  url: string
}

function WithProperty(props: Props) {
  return <div />
}

WithProperty.fragmentSpec = {
  fragment: '',
}

export default WithProperty
