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
      <header className="ss-border-b ss-border-faint ss-pb-6 ss-mb-6">
        <Heading as="h1">{data?.frontmatter?.title ?? data?.slug}</Heading>
        {data?.frontmatter?.description ? (
          <p className="ss-mt-2 ss-text-foreground-faint ss-max-w-lg">
            {data?.frontmatter?.description}
          </p>
        ) : null}
      </header>
      <div className="ss-pb-12">{content}</div>
      <div className="ss-mt-auto ss-border-t ss-border-faint ss-pt-12 ss-text-right">
        <OpenInEditor path={data.filepath} />
      </div>
    </>
  )
}
