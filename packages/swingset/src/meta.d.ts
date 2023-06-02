/**
 * This file is a stub for a loader target and should never be imported directly
 */
import { EvaluatedEntity } from './types'

declare const meta: EvaluatedEntity[]
export default meta

export function getEntity(slug: string): EvaluatedEntity | undefined

export function getNestedEntities(slug: string): ComponentEntity[]

export const categories: Record<string, string[]>
