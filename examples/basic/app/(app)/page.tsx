'use client'
import { useRouter } from 'next/navigation'
/*Once this page starts to get built, make this can be server component again */

export default function Index() {
  const router = useRouter()
  router.push('/swingset')

  return <h1>redirecting...</h1>
}
