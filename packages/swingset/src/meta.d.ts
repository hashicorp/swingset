/**
 * This file is a stub for a loader target and should never be imported directly
 */
import { Entity } from './types'

declare const meta: Entity[]
export default meta

export function getEntity(slug: string): Entity

export function getNestedEntities(slug: string): ComponentEntity[]

export const categories: Record<string, string[]>
