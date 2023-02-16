import data from 'swingset/__component-data'

export default async function Page({ params }) {
  const component = params.path.join('/')
  const componentData = data[component]

  const Content = await componentData.loadDocs()

  return <Content />
}
