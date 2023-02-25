// @ts-expect-error -- this should be resolved once the theme is externalized
import { getEntity } from 'swingset/meta'
// @ts-expect-error
import { RenderDocs } from 'swingset/render'

export default async function Page({ params }: { params: any }) {
  const slug = params.path.join('/')
  const pageData = getEntity(slug)

  return (
    <>
      <h1>{pageData?.frontmatter?.title ?? pageData?.slug}</h1>
      <p>{pageData?.frontmatter?.description}</p>
      <RenderDocs component={slug} />
    </>
  )
}
