import { meta } from 'swingset/meta'

declare global {
  interface Window {
    __SWINGSET_META: typeof meta
  }
}
