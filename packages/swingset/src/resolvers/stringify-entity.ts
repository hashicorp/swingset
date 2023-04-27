import { Entity } from '../types'

export function stringifyEntity(entity: Entity) {
  return `{
    ${Object.entries(entity)
      .map(([key, value]) => {
        // We don't want the load function to stringified as a string, so drop it in without quotes
        if (key === 'load') {
          return `load: ${value}`
        }

        return `${key}: ${JSON.stringify(value)}`
      })
      .join(',\n')}
  }`
}
