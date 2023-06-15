'use client'
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
    <ul className={cx(
      'ss-mt-2 ss-space-y-1',
      isNested && 'ss-ml-2 ss-border-l ss-border-faint ss-mt-0'
    )}>
      {items.map((item) => {
        const isFolder = item.type === 'folder'
        console.log(item)
        return (
          <li key={item.title} >
            {isFolder ? (
              <Folder title={item.title} items={item.children} />
            ) : (
              <Link
              className={cx(
                'ss-text-foreground-primary hover:ss-text-foreground-action hover:ss-bg-surface-action',
                'ss-group ss-flex ss-gap-x-3 ss-rounded-md ss-p-2 ss-text-sm ss-leading-6'
              )}
                href={`swingset/${item.slug}`}
              >
                {item.title}
              </Link>
            )}
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
          'ss-text-foreground-primary hover:ss-text-foreground-action hover:ss-bg-surface-action',
          'ss-rounded-md ss-p-2 ss-text-sm ss-leading-6'
        )}
      >
        {title}
      </summary>
      <ComponentList isNested={true} items={items} />
    </details>
  )
}

export default Category
