import { useRouter } from 'next/router'
import Link from 'next/link'
import classnames from 'classnames'
import { useBaseRoute } from '../../utils/use-base-route'
import s from './style.module.css'
import { Fragment } from 'react'

export default function Nav({ navData }) {
  const router = useRouter()
  const baseRoute = useBaseRoute()

  return navData.map((category) => {
    return (
      <Fragment key={category.name}>
        <li className={s.categoryHeading}>
          <strong>{category.name}</strong>
        </li>
        {category.routes.map((route) => {
          const href = `${baseRoute}/${route.sourceType}/${route.slug}`
          return (
            <li key={route.name}>
              <Link href={href}>
                <a
                  className={classnames(
                    s.navItem,
                    router.asPath === href && s.active
                  )}
                >
                  {route.name}
                </a>
              </Link>
            </li>
          )
        })}
      </Fragment>
    )
  })
}
