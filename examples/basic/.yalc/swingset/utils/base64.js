export function encode(str) {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)
}

export function decode(str) {
  return typeof window === 'undefined'
    ? Buffer.from(str, 'base64').toString('utf8')
    : window.atob(str)
}
