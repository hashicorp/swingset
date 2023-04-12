import { PropsTable } from './components/props-table'
import { Heading } from './components/heading'

export default {
  h1: (props: any) => <Heading as="h1" {...props} />,
  h2: (props: any) => <Heading as="h2" {...props} />,
  h3: (props: any) => <Heading as="h3" {...props} />,
  h4: (props: any) => <Heading as="h4" {...props} />,
  h5: (props: any) => <Heading as="h5" {...props} />,
  h6: (props: any) => <Heading as="h6" {...props} />,
  p: (props: any) => <p className="ss-my-4" {...props} />,
  pre: (props: any) => <pre className="ss-my-4" {...props} />,
  PropsTable,
}
