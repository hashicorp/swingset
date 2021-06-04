import s from './style.module.css'
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote'
import createScope from './utils/create-scope'
import { findComponent, findEntity } from './utils/find-entity'
import { components, docs } from './__swingset_data'
import { getPeerComponents } from './utils/get-peer-components'
import { useBaseRoute } from './utils/use-base-route'
import Nav from './components/nav'

export default function createPage(swingsetOptions = {}) {
  return function Page({ sourceType, mdxSource, navData }) {
    // tracks the name of the current component
    const router = useRouter()
    const baseRoute = useBaseRoute()
    const [filterValue, setFilterValue] = useState()
    const searchInputRef = useRef()

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

    // finds the actual entity
    const entity = findEntity(router.query)
    const peerComponents = getPeerComponents(entity, components)

    // Filter listed components based on the current filterValue
    const filteredNav = filterValue
      ? navData.map((category) => ({
          ...category,
          routes: category.routes.filter((route) =>
            route.name.toLowerCase().startsWith(filterValue.toLowerCase())
          ),
        }))
      : navData

    return (
      <div className={s.root}>
        <Head>
          <title key="title">Component Library</title>
        </Head>
        <ul className={s.sidebar}>
          <Link href={baseRoute || '/'}>
            <a>{swingsetOptions.logo ?? <span className={s.logo} />}</a>
          </Link>
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
          <Nav navData={filteredNav} />
        </ul>
        <div className={s.stage}>
          {sourceType === 'index' ? (
            swingsetOptions.index ?? <IndexPage />
          ) : sourceType === 'docs' ? (
            <DocsPage mdxSource={mdxSource} peerComponents={peerComponents} />
          ) : sourceType === 'components' ? (
            <ComponentPage
              mdxSource={mdxSource}
              component={entity}
              swingsetOptions={swingsetOptions}
              peerComponents={peerComponents}
            />
          ) : (
            <div>Houston we have a problem</div>
          )}
        </div>
      </div>
    )
  }
}

function IndexPage() {
  return <h1>Welcome to Swingset!</h1>
}

function DocsPage({ mdxSource, peerComponents }) {
  return <MDXRemote {...mdxSource} components={peerComponents} />
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
