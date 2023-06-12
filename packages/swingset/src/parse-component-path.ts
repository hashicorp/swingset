import { Entity } from './types'

/**
 * Takes in the front matter path property, and parses it into
 * navigation metadata
 *  Example:
 * parseComponentPath('Components/Forms/Input')
 * outputs: { category: 'Components', folder: 'Forms', page: 'Input' }
 */
export function parseComponentPath(rawPath: string): Entity['parsedPath'] {
  const rawPathArr = rawPath.split('/');

  const firstElNotEmpty = rawPathArr[0] !== '';
  const inRange = rawPathArr.length >= 1 && rawPathArr.length <= 3
  const isValidPath = inRange && firstElNotEmpty

  if (!isValidPath) {
    throw new Error(
      `Segments must be <= 3 AND >= 1. Received: ${rawPathArr.length}, ${rawPath}`
    )
  }

  let result: Entity['parsedPath'] = {
    page: '',
  }

  if (rawPathArr.length === 3) {
    result = {
      category: rawPathArr[0],
      folder: rawPathArr[1],
      page: rawPathArr[2],
    }
  }
  if (rawPathArr.length === 2) {
    result = {
      category: rawPathArr[0],
      page: rawPathArr[1],
    }
  }

  if (rawPathArr.length === 1) {
    result = {
      page: rawPathArr[0],
    }
  }

  return result
}
