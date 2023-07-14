import { PropsTable } from './components/props-table'
import { Heading, Body } from './components/text'
import { LiveComponent } from './components/live-component'
import { CodeBlock } from './components/code-block'

const MDXComponents = {
  h1: (props: any) => <Heading as="h1" {...props} />,
  h2: (props: any) => <Heading as="h2" {...props} />,
  h3: (props: any) => <Heading as="h3" {...props} />,
  h4: (props: any) => <Heading as="h4" {...props} />,
  h5: (props: any) => <Heading as="h5" {...props} />,
  h6: (props: any) => <Heading as="h6" {...props} />,
  p: (props: any) => <Body {...props} />,
  pre: (props: any) => <CodeBlock {...props} />,
  PropsTable,
  LiveComponent,
  CodeBlock,
}

export default MDXComponents
