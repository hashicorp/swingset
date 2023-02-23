// @ts-expect-error -- this should be resolved once the theme is externalized
import { getDocsMeta, getComponentMeta } from 'swingset/meta'

interface RenderDocsProps {
  component: string
}

export async function RenderDocs({ component }: RenderDocsProps) {
  const componentData = getComponentMeta(component)
  const doc = getDocsMeta(component)

  if (doc) {
    const Content = await doc.load()

    return <Content />
  }

  if (componentData) {
    const Content = await componentData.load()

    return <Content />
  }

  return null
}
