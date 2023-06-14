import { NavigationTree } from 'swingset/types'
import Category from './category'

/*
Keeping to reference old styling
================================
function NavList({ items, level }: any) {
 const isNested = level > 0

 return (
   <ul
     role="list"
     className={cx(
       'ss-mt-2 ss-space-y-1',
       isNested && 'ss-ml-2 ss-border-l ss-border-faint ss-mt-0'
     )}
   >
     {items.map(({ title, slug, children }: any) => (
       <li key={slug}>
         <Link
           href={`/swingset/${slug}`}
           className={cx(
             'ss-text-foreground-primary hover:ss-text-foreground-action hover:ss-bg-surface-action',
             'ss-group ss-flex ss-gap-x-3 ss-rounded-md ss-p-2 ss-text-sm ss-leading-6'
           )}
         >
           {title}
         </Link>
         {children && <NavList level={level + 1} items={children} />}
       </li>
     ))}
   </ul>
 )
}
*/

type SideNavBarProps = {
  categories: NavigationTree
}

function SideNavBar(props: SideNavBarProps) {
  const { categories } = props

  
 

  const categoriesArr = Object.entries(categories)
  

  const categoriesJSX = categoriesArr.map(([category, entities]) => {

    return <Category
      title={category}
      key={category} 
      items={entities}
      />

  })




  return (
    <nav>
      {categoriesJSX}
    </nav>
  )
}

export default SideNavBar
