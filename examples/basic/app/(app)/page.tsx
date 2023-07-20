'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Index() {
  useEffect(() => {
    const router = useRouter()
    router.push('/swingset')
  }, [])

  return <h1>Hello world</h1>
}
