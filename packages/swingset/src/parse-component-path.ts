import { ComponentEntity } from './types'

/**
 * Takes in the front matter path property, and parses it into
 * navigation metadata
 *  Example:
 * parseComponentPath('Components/Forms/Input')
 * outputs: { category: 'Components', folder: 'Forms', page: 'Input' }
 */
export function parseComponentPath(rawPath: string): ComponentEntity['navigationData'] {


  
  const rawPathArr = rawPath.split('/');

  
 

  if (rawPathArr.length > 3) {
    throw new Error(
      `Received Component path with more than 3 segments: '${rawPath}'. Remove the extra segments. Expected format: '[Category]/[Folder]/[Page]'`
    )
  }

  let result: ComponentEntity['navigationData'] = {
    category: 'default',
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
      category: 'default',
      page: rawPathArr[0],
    }
  }

  return result
}
