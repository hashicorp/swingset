import s from './style.module.css'
import { useState, useRef } from 'react'
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

    // if there's a component specified in the querystring, set that to current
    useRestoreUrlState(({ component }) => {
      if (component && components[component]) {
        setName(component)
      } else {
        setComponentNotFound(component)
      }
    })

    // finds the actual component
    const Component = components[name].src

    // fully hydrated mdx document, with the components in the created scope available for use
    const mdx = hydrate(mdxSources[name], {
      components: createScope({ [name]: Component }, swingsetOptions),
    })

    const filteredComponents = componentNames.filter(
      (comp) =>
        !filterValue || comp.toLowerCase().startsWith(filterValue.toLowerCase())
    )

    return (
      <div className={s.root}>
        <Head>
          <title key="title">Component Library</title>
        </Head>
        <ul className={s.sidebar}>
          {swingsetOptions.logo ?? <span className={s.logo} />}
          <input
            type="input"
            onChange={(evt) => setFilterValue(evt.currentTarget.value)}
            placeholder="Search"
            className={s.search}
          />
          {filteredComponents.map((componentName) => {
            return (
              <li
                className={componentName === name ? s.active : ''}
                key={componentName}
                onClick={() => {
                  setName(componentName)
                  setUrlState(componentName)
                }}
              >
                {componentName}
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
