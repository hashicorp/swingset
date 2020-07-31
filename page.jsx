import s from './style.module.css'
import { useState } from 'react'
import Head from 'next/head'
import hydrate from 'next-mdx-remote/hydrate'
import allComponents, { _importMeta } from '../packages/*'
import findComponent from './utils/find-component'
import createScope from './utils/create-scope'
import { useRestoreUrlState, setUrlState } from './utils/url-state'

export default function createPage(octavoOptions = {}) {
  return function Page({ mdxSources, docsSrcs }) {
    // tracks the name of the current component
    const [name, setName] = useState(docsSrcs[0].data.componentName)

    // if there's a component specified in the querystring, set that to current
    useRestoreUrlState(({ component }) => component && setName(component))

    // finds the actual component, given the component name and some places to search
    const Component = findComponent(name, {
      docsSrcs,
      allComponents,
      _importMeta,
    })

    // fully hydrated mdx document, with the components in the created scope available for use
    const mdx = hydrate(
      mdxSources[name],
      createScope({ [name]: Component }, octavoOptions)
    )

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
          {docsSrcs.map(({ data }) => {
            return (
              <li
                className={data.componentName === name ? s.active : ''}
                key={data.componentName}
                onClick={() => {
                  setName(data.componentName)
                  setUrlState(data.componentName)
                }}
              >
                {data.componentName}
              </li>
            )
          })}
        </ul>
        <div className={s.stage}>{mdx}</div>
      </div>
    )
  }
}
