import { encode } from './base64'
import hash from './simplehash'

// given some sort of input, hash it out then encode to base64 and remove trailing "="
// this makes a unique, relatively short id that can be placed on the element
export default function createId(input: any) {
  return encode(
    hash(typeof input === 'string' ? input : JSON.stringify(input)).toString()
  ).replace(/=+/, '')
}
