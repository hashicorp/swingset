'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
/*Once this page starts to get built, make this can be server component again */

export default function Index() {
  const router = useRouter()
  useEffect(() => router.push('/swingset'), [])

  return <h1>Hello world</h1>
}
