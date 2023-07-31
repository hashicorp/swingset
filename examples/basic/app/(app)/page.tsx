/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    router.push('/swingset')
  }, [])

  return <h1>Hello World</h1>
}
