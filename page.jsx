import s from './style.module.css'
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import hydrate from 'next-mdx-remote/hydrate'
import createScope from './utils/create-scope'
import { useRestoreUrlState, setUrlState } from './utils/url-state'
import components from './__swingset_components'

export default function createPage(swingsetOptions = {}) {
  return function Page({ mdxSources, componentNames }) {
    // tracks the name of the current component
    const [name, setName] = useState(componentNames[0])
    const [filterValue, setFilterValue] = useState()
    const [componentNotFound, setComponentNotFound] = useState(false)

    const searchInputRef = useRef()

    // if there's a component specified in the querystring, set that to current
    useRestoreUrlState(({ component }) => {
      if (component && components[component]) {
        setName(component)
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
    const component = components[name]
    const Component = component.src

    let peerComponents = {}
    if (component.data.peerComponents) {
      component.data.peerComponents.forEach((name) => {
        const { src } = components[name]
        if (!src) {
          console.warn(
            `${frontMatter.componentName} lists ${name} as a peerComponent but <${name} /> is not in scope`
          )
        } else {
          peerComponents = Object.assign(peerComponents, {
            [name]: src,
          })
        }
      })
    }


    // fully hydrated mdx document, with the components in the created scope available for use
    const mdx = hydrate(mdxSources[name], {
      components: createScope({ [name]: Component }, swingsetOptions, peerComponents),
    })

    // Filter listed components based on the current filterValue
    const filteredComponents = filterValue
      ? componentNames.filter((comp) =>
          comp.toLowerCase().startsWith(filterValue.toLowerCase())
        )
      : componentNames

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
          {filteredComponents.map((componentName) => {
            return (
              <li
                className={componentName === name ? s.active : ''}
                key={componentName}
              >
                <a
                  href={`?component=${componentName}`}
                  onClick={(e) => {
                    setName(componentName)
                    setUrlState(componentName)
                    e.preventDefault()
                  }}
                >
                  {componentName}
                </a>
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
