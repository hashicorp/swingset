import s from './style.module.css'
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote'
import createScope from './utils/create-scope'
import { useRestoreUrlState, setUrlState } from './utils/url-state'
import { findComponent } from './utils/find-component'
import components from './__swingset_components'
import { getPeerComponents } from './utils/get-peer-components'

export default function createPage(swingsetOptions = {}) {
  return function Page({ mdxSource, navData, initialParams }) {
    // tracks the name of the current component
    const router = useRouter()
    const [filterValue, setFilterValue] = useState()
    const [componentNotFound, setComponentNotFound] = useState(false)

    const searchInputRef = useRef()

    // if there's a component specified in the querystring, set that to current
    useRestoreUrlState(({ component }) => {
      if (component && components[component]) {
        console.log('hi! i do nothing!')
      } else {
        setComponentNotFound(component)
      }
    })

    // Focus the search input when pressing the '/' key
    useEffect(() => {
      function onKeyDown(e) {
        const elt = e.target || e.srcElement
        const tagName = elt.tagName
        if (
          elt.isContentEditable ||
          tagName === 'INPUT' ||
          tagName === 'SELECT' ||
          tagName === 'TEXTAREA'
        ) {
          // Already in an input
          return
        }

        // Bind to the `/` key
        if (e.keyCode !== 191) return

        searchInputRef.current?.focus()
        e.stopPropagation()
        e.preventDefault()
      }

      window.addEventListener('keydown', onKeyDown)

      return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    // finds the actual component
    const component = findComponent(components, router.query)
    const Component = component.src

    const peerComponents = getPeerComponents(component, components)

    // fully hydrated mdx document, with the components in the created scope available for use
    const mdx = (
      <MDXRemote
        {...mdxSource}
        components={createScope(
          { [component.data.componentName]: Component },
          swingsetOptions,
          peerComponents
        )}
      />
    )

    // Filter listed components based on the current filterValue
    const filteredComponents = filterValue
      ? navData.filter((comp) =>
          comp.name.toLowerCase().startsWith(filterValue.toLowerCase())
        )
      : navData

    return (
      <div className={s.root}>
        <Head>
          <title key="title">Component Library</title>
        </Head>
        <ul className={s.sidebar}>
          {swingsetOptions.logo ?? <span className={s.logo} />}
          <div className={s.searchContainer}>
            <input
              type="input"
              ref={searchInputRef}
              onChange={(e) => setFilterValue(e.currentTarget.value)}
              placeholder="Search"
              className={s.search}
            />
            <span className={s.searchHint} aria-label="Type '/' to search">
              /
            </span>
          </div>
          {filteredComponents.map((filteredComponent) => {
            return (
              <li
                className={
                  filteredComponent.name === component.data.componentName
                    ? s.active
                    : ''
                }
                key={filteredComponent.name}
              >
                <Link
                  href={`${filteredComponent.sourceType}/${filteredComponent.slug}`}
                >
                  <a>{filteredComponent.name}</a>
                </Link>
              </li>
            )
          })}
        </ul>
        <div className={s.stage}>
          {componentNotFound && (
            <p className={s.notFound}>
              ⚠️ Component "{componentNotFound}" was not found
            </p>
          )}
          {mdx}
        </div>
      </div>
    )
  }
}
