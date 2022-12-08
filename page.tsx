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
import classNames from 'classnames'

export default function createPage(swingsetOptions: SwingsetOptions = {}) {
  return function Page({ sourceType, mdxSource, navData }: SwingsetPageProps) {
    // tracks the name of the current component
    const router = useRouter()
    const baseRoute = useBaseRoute()
    const [filterValue, setFilterValue] = useState<string | undefined>()
    const searchInputRef = useRef<HTMLInputElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const handleFullscreenBttnClick = () => {
      setIsFullscreen(!isFullscreen);
    }

    // Focus the search input when pressing the '/' key
    useEffect(() => {
      function onKeyDown(e: KeyboardEvent) {
        const elt = e.target || e.srcElement

        if (elt instanceof HTMLElement) {
          const tagName = elt.tagName
          if (
            ('isContentEditable' in elt && elt.isContentEditable) ||
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
        <div className={classNames(s.sidebar, { [s.isFullscreen]: isFullscreen})}>
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
        <div className={classNames(s.stage, { [s.isFullscreen]: isFullscreen})}>
          <button className={s.fullscreenBttn} aria-labelledby="buttonLabel" onClick={handleFullscreenBttnClick}>
            { isFullscreen ? (<CloseFullscreenIcon />) : (<FullscreenIcon />)}
            <span id="buttonLabel" hidden>{ isFullscreen ? 'Close fullscreen' : 'Enter fullscreen'}</span>    
          </button>
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

const FullscreenIcon = () => {
  return (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5 19v-5h2v3h3v2Zm0-9V5h5v2H7v3Zm9 9v-2h3v-3h2v5Zm3-9V7h-3V5h5v5Z"></path></svg>
  )
}

const CloseFullscreenIcon = () => {
  return (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M8 19v-3H5v-2h5v5Zm6 0v-5h5v2h-3v3Zm-9-9V8h3V5h2v5Zm9 0V5h2v3h3v2Z"/></svg>
  )
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
