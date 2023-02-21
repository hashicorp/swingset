// @ts-expect-error -- this should be resolved once the theme is externalized
import data from 'swingset/meta'

export default async function Page({ params }: { params: any }) {
  const component = params.path.join('/')
  const componentData = data[component]

  if (componentData) {
    const Content = await componentData.loadDocs()

    return <Content />
  }

  return null
}
