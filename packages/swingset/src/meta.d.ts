/**
 * This file is a stub for a loader target and should never be imported directly
 */
import { EvaluatedEntity } from './types'

export const meta: Record<string, EvaluatedEntity>

export const categories: Record<string, string[]>

export function getEntity(slug: string): EvaluatedEntity | undefined

export function getNestedEntities(slug: string): ComponentEntity[]

export const generateStaticParams: () => { path: string[] }[]
