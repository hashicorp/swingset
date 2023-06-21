'use client'
import { SideNavigation } from './components/side-nav'
import { meta, categories } from 'swingset/meta'
import { useEffect, useRef } from 'react'

export function App() {
 const info = useRef({ renderCount: 0, effectRan: 0 })

 useEffect(() => {
  window.__SWINGSET_META = meta
  info.current.effectRan++
  console.dir(info.current)
 }, [meta])
 info.current.renderCount++
 console.dir(info.current)

 return <SideNavigation categories={categories} />
}
