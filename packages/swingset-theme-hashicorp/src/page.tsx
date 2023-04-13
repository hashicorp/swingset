import { Heading } from './components/heading'
import { OpenInEditor } from './components/open-in-editor'

export default async function Page({
  data,
  content,
}: {
  data: any
  content: React.ReactNode
}) {
  return (
    <>
      <Heading as="h1">{data?.frontmatter?.title ?? data?.slug}</Heading>
      <p>{data?.frontmatter?.description}</p>
      {content}
      <div className="ss-mt-4 ss-text-right">
        <OpenInEditor path={data.filepath} />
      </div>
    </>
  )
}
