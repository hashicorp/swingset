// @ts-expect-error -- this should be resolved once the theme is externalized
import { getEntity } from 'swingset/meta'
import { RenderDocs } from './render'

export function createPage(ChildPage: React.ComponentType) {
  return function SwingsetPage(props: any) {
    const { params } = props
    const slug = params.path.join('/')

    const entity = getEntity(slug)

    return (
      <ChildPage
        data={entity}
        {...props}
        // @ts-expect-error -- Server components
        content={<RenderDocs data={entity} />}
      />
    )
  }
}
