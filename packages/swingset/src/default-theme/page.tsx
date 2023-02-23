// @ts-expect-error -- this should be resolved once the theme is externalized
import { getComponentMeta } from 'swingset/meta'
// @ts-expect-error
import { RenderDocs } from 'swingset/render'

export default async function Page({ params }: { params: any }) {
  const component = params.path.join('/')
  const componentData = getComponentMeta(component)

  return (
    <>
      <h1>{componentData?.slug}</h1>
      <p>{componentData?.frontmatter?.description}</p>
      <RenderDocs component={component} />
    </>
  )
}
