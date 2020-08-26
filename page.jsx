import s from './style.module.css'
import { useState } from 'react'
import Head from 'next/head'
import hydrate from 'next-mdx-remote/hydrate'
import createScope from './utils/create-scope'
import { useRestoreUrlState, setUrlState } from './utils/url-state'
import components from './__octavo_components'

export default function createPage(octavoOptions = {}) {
  return function Page({ mdxSources, componentNames }) {
    // tracks the name of the current component
    const [name, setName] = useState(componentNames[0])

    // if there's a component specified in the querystring, set that to current
    useRestoreUrlState(({ component }) => component && setName(component))

    // finds the actual component
    const Component = components[name].src

    // fully hydrated mdx document, with the components in the created scope available for use
    const mdx = hydrate(mdxSources[name], {
      components: createScope({ [name]: Component }, octavoOptions),
    })

    return (
      <div className={s.root}>
        <Head>
          <title key="title">Component Library</title>
        </Head>
        <ul className={s.sidebar}>
          <img
            className={s.logo}
            src={require('./img/octavo-dark.svg')}
            alt="octavo logo"
          />
          {componentNames.map((componentName) => {
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
        <div className={s.stage}>{mdx}</div>
      </div>
    )
  }
}
