import { useRouter } from 'next/router'

export function useBaseRoute() {
  const router = useRouter()
  return router.pathname.split('/').slice(0, -1).join('/')
}
