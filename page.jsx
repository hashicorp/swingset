import s from './style.module.css'
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote'
import createScope from './utils/create-scope'
import { useRestoreUrlState, setUrlState } from './utils/url-state'
import { findComponent } from './utils/find-component'
import { components } from './__swingset_data'
import { getPeerComponents } from './utils/get-peer-components'

export default function createPage(swingsetOptions = {}) {
  return function Page({ sourceType, mdxSource, navData }) {
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
    const component =
      sourceType === 'components'
        ? findComponent(components, router.query)
        : null
    const peerComponents =
      sourceType === 'components'
        ? getPeerComponents(component, components)
        : null

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
            const href = `${filteredComponent.sourceType}/${filteredComponent.slug}`
            // @TODO this only works if [[...swingset]].jsx is on the base route.
            // we need to update to account for non-base route locations.
            return (
              <li
                className={router.asPath === `/${href}` ? s.active : ''}
                key={filteredComponent.name}
              >
                <Link href={href}>
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

          {sourceType === 'index' ? (
            <IndexPage />
          ) : sourceType === 'docs' ? (
            <DocsPage mdxSource={mdxSource} />
          ) : sourceType === 'components' ? (
            <ComponentPage
              mdxSource={mdxSource}
              component={component}
              swingsetOptions={swingsetOptions}
              peerComponents={peerComponents}
            />
          ) : (
            <NotFoundPage />
          )}
        </div>
      </div>
    )
  }
}

function IndexPage() {
  return (
    <pre>
      <code>Index page placeholder</code>
    </pre>
  )
}

function DocsPage({ mdxSource }) {
  return <MDXRemote {...mdxSource} />
}

function ComponentPage({
  mdxSource,
  component,
  swingsetOptions,
  peerComponents,
}) {
  return (
    <MDXRemote
      {...mdxSource}
      components={createScope(
        { [component.data.componentName]: component.src },
        swingsetOptions,
        peerComponents
      )}
    />
  )
}

/*

<MDXRemote
              {...mdxSource}
              components={createScope(
                { [component.data.componentName]: component.src },
                swingsetOptions,
                peerComponents
              )}
            />

            */

function NotFoundPage() {
  return (
    <pre>
      <code>Not found page placeholder</code>
    </pre>
  )
}
