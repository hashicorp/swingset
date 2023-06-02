import { type ElementType, type ReactElement } from 'react'
import { EvaluatedEntity } from './types'

declare const Layout: ElementType<{ children: ReactElement }>

export default Layout

export const Page: ElementType<{ data: EvaluatedEntity; content: ReactElement }>
