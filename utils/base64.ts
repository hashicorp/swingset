export function encode(str: string) {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)
}

export function decode(str: string) {
  return typeof window === 'undefined'
    ? Buffer.from(str, 'base64').toString('utf8')
    : window.atob(str)
}
