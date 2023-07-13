import { NavigationNode, ComponentNode } from 'swingset/types'
import { LinkItem } from './link-item'
import { cx } from 'class-variance-authority'

function Category({
  title,
  items,
}: {
  title: string
  items: NavigationNode[]
}) {
  console.log(title)
  return (
    <li className="ss-list-none">
      <section className="ss-mb-4">
        <CategoryHeading>{title}</CategoryHeading>
        <ComponentList items={items} />
      </section>
    </li>
  )
}
//Swap this out for already existing heading && Enquire about semantics, https://helios.hashicorp.design/components/application-state uses <div>
function CategoryHeading({ children }: { children: string }) {
  return (
    <div className="ss-capitalize ss-text-xs ss-font-semibold ss-leading-6 ss-text-primary ss-border-b ss-border-faint ss-pb-2">
      {children}
    </div>
  )
}

function ComponentList({
  isNested,
  items,
}: {
  isNested?: true
  items: NavigationNode[]
}) {
  return (
    <ul
      className={cx(
        'ss-mt-2 ss-space-y-1',
        isNested && 'ss-ml-2 ss-border-l ss-border-faint ss-mt-0'
      )}
    >
      {items.map((item) => {
        const isFolder = item.__type === 'folder'

        if (isFolder) {
          return (
            <Folder key={item.title} title={item.title} items={item.children} />
          )
        }

        return (
          <li key={item.title}>
            <LinkItem to={item.slug} title={item.title} />
          </li>
        )
      })}
    </ul>
  )
}

function Folder({
  title,
  items,
}: {
  title: ComponentNode['title']
  items: ComponentNode[]
}) {
  return (
    <details>
      <summary
        className={cx(
          'ss-text-primary hover:ss-text-action hover:ss-bg-surface-action',
          'ss-rounded-md ss-p-2 ss-text-sm ss-leading-6 ss-cursor-pointer'
        )}
      >
        {title}
      </summary>
      <ComponentList isNested items={items} />
    </details>
  )
}

export default Category
