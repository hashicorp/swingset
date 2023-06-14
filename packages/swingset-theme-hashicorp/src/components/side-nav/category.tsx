import { NavigationNode, ComponentNode } from 'swingset/types'
import { Link } from '../link'
import { cx } from 'class-variance-authority'

function Category({
  title,
  items,
}: {
  title: string
  items: NavigationNode[]
}) {
  return (
    <li className="ss-list-none">
      <section>
        <CategoryHeading>{title.toUpperCase()}</CategoryHeading>
        <ComponentList items={items} />
      </section>
    </li>
  )
}
//Swap this out for already existing heading
function CategoryHeading({ children }: { children: string }) {
  return <h4>{children.toUpperCase()}</h4>
}

function ComponentList({
  isNested,
  items,
}: {
  isNested?: true 
  items: NavigationNode[]
}) {
  return (
    <ul>
      {items.map((item) => {
        const isFolder = item.type === 'folder'

        return (
          <li key={item.title} className={cx(isNested && 'ss-text-red-600')}>
            {isFolder ? (
              <Folder title={item.title} items={item.children} />
            ) : (
              <Link href={`swingset/${item.slug}`}>{item.title}</Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function Folder({ title, items }: { title: ComponentNode['title']; items: ComponentNode[] }) {
  return (
    <details>
      <summary>{title}</summary>
      <ComponentList isNested={true} items={items} />
    </details>
  )
}

export default Category
