// @ts-expect-error -- this should be resolved once the theme is externalized
import { getEntity } from 'swingset/meta'

interface RenderDocsProps {
  component: string
}

export async function RenderDocs({ component }: RenderDocsProps) {
  const entity = getEntity(component)

  if (entity) {
    const Content = await entity.load()

    return <Content />
  }

  return null
}
