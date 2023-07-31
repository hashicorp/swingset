/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * This file is a stub for a loader target and should never be imported directly
 */
import { EvaluatedEntity, NavigationTree, ComponentEntity } from './types'

export const meta: Record<string, EvaluatedEntity>

export const categories: NavigationTree

export function getEntity(slug: string): EvaluatedEntity | undefined

export function getNestedEntities(slug: string): ComponentEntity[]

export const generateStaticParams: () => { path: string[] }[]
