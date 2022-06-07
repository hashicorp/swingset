import s from './style.module.css'
import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import createScope from './utils/create-scope'
import { findEntity } from './utils/find-entity'
import { components } from './__swingset_data'
import { getPeerComponents } from './utils/get-peer-components'
import { useBaseRoute } from './utils/use-base-route'
import Nav from './components/nav'
import { ComponentData, SwingsetPageProps, SwingsetOptions } from './types'

export default function createPage(swingsetOptions: SwingsetOptions = {}) {
  return function Page({ sourceType, mdxSource, navData }: SwingsetPageProps) {
    // tracks the name of the current component
    const router = useRouter()
    const baseRoute = useBaseRoute()
    const [filterValue, setFilterValue] = useState<string | undefined>()
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Focus the search input when pressing the '/' key
    useEffect(() => {
      function onKeyDown(e: KeyboardEvent) {
        const elt = e.target || e.srcElement

        if (elt instanceof Element) {
          const tagName = elt.tagName
          if (
            'isContentEditable' in elt ||
            tagName === 'INPUT' ||
            tagName === 'SELECT' ||
            tagName === 'TEXTAREA'
          ) {
            // Already in an input
            return
          }

          if (e.key !== '/') return

          searchInputRef.current?.focus()
          e.stopPropagation()
          e.preventDefault()
        }
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
            route.name.toLowerCase().includes(filterValue.toLowerCase())
          ),
        }))
      : navData

    return (
      <div className={s.root}>
        <Head>
          <title key="title">Component Library</title>
        </Head>
        <div className={s.sidebar}>
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
        </div>
        <div className={s.stage}>
          {sourceType === 'index' ? (
            swingsetOptions.index ?? <IndexPage />
          ) : sourceType === 'docs' ? (
            <DocsPage
              mdxSource={mdxSource}
              peerComponents={peerComponents}
              swingsetOptions={swingsetOptions}
            />
          ) : sourceType === 'components' ? (
            <ComponentPage
              mdxSource={mdxSource}
              component={entity as ComponentData}
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

function DocsPage({
  mdxSource,
  peerComponents,
  swingsetOptions,
}: {
  mdxSource: MDXRemoteSerializeResult
  peerComponents: Record<string, React.ElementType>
  swingsetOptions: SwingsetOptions
}) {
  return (
    <MDXRemote
      {...mdxSource}
      components={createScope({}, swingsetOptions, peerComponents)}
    />
  )
}

function ComponentPage({
  mdxSource,
  component,
  swingsetOptions,
  peerComponents,
}: {
  mdxSource: MDXRemoteSerializeResult
  component: ComponentData
  swingsetOptions: SwingsetOptions
  peerComponents: Record<string, React.ElementType>
}) {
  const { default: defaultExport, ...namedExports } = component.exports

  if (!component.data.componentName) {
    throw new Error('Missing component name')
  }

  return (
    <MDXRemote
      {...mdxSource}
      components={createScope(
        {
          [component.data.componentName]: defaultExport,
          ...namedExports,
        },
        swingsetOptions,
        peerComponents
      )}
      scope={{ ...mdxSource.scope, ...namedExports }}
    />
  )
}
