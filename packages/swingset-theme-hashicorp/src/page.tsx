import { ComponentEntity, EvaluatedEntity } from 'swingset/types'
import { Heading, Body } from './components/text'
import { OpenInEditor } from './components/open-in-editor'
import localFont from '@next/font/local'

export default async function Page({
  data,
  content,
}: {
  data: EvaluatedEntity
  content: React.ReactNode
}) {
  const title = (data?.frontmatter?.title ??
    (data as EvaluatedEntity<ComponentEntity>)?.slug) as string

  return (
    <>
      <header className="ss-border-b ss-border-faint ss-pb-6 ss-mb-6">
        <Heading as="h1">{title}</Heading>
        {data?.frontmatter?.description ? (
          <Body>{data?.frontmatter?.description as string}</Body>
        ) : null}
      </header>
      <div className="ss-pb-12">{content}</div>
      <div className="ss-mt-auto ss-border-t ss-border-faint ss-pt-12 ss-text-right">
        <OpenInEditor path={data.filepath} />
      </div>
    </>
  )
}
