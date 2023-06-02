import { type ElementType, type ReactElement } from 'react'
import { EvaluatedEntity, SwingsetPageProps } from './types'

declare const Layout: ElementType<{ children: ReactElement }>

export default Layout

export const Page: ElementType<SwingsetPageProps>
