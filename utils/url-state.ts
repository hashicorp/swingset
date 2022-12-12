import { useEffect } from 'react'
import queryString from 'query-string'
import Router from 'next/router'
import { encode, decode } from './base64'
import copy from 'copy-text-to-clipboard'

export function useRestoreUrlState(cb: (arg: any) => void) {
  useEffect(() => {
    if (window.location.search) {
      const qs = queryString.parse(window.location.search)
      if (qs.values) qs.values = JSON.parse(decode(qs.values as string))
      window.location.search && cb(qs)
    }
  }, [])
}

export function setUrlState(id: string, values: any, copyToClipboard: boolean) {
  const qs = queryString.stringify({
    id,
    values: values && encode(JSON.stringify(values)),
  })

  Router.push(`${window.location.pathname}?${qs}`, undefined, { shallow: true })

  if (copyToClipboard) copy(window.location.href)
}
