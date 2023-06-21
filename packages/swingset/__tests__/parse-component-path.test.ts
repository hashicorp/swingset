import { describe, it } from 'vitest'
import { parseComponentPath } from '../src/parse-component-path'

describe(parseComponentPath.name, () => {
  it('Converts a 3 segment path to a navigationData object', ({ expect }) => {
    const expectation = {
      category: 'Components',
      folder: 'Forms',
      page: 'Input',
    }

    const result = parseComponentPath('Components/Forms/Input')

    expect(result).toEqual(expectation)
  })
  it('Converts a 2 segment path to a navigationData object', ({ expect }) => {
    const expectation = {
      category: 'Components',
      page: 'Button',
    }

    const result = parseComponentPath('Components/Button')

    expect(result).toEqual(expectation)
  })
  it('Converts a 1 segment path to a navigationData object', ({ expect }) => {
    const expectation = {
      category: 'default',
      page: 'Button',
    }

    const result = parseComponentPath('Button')

    expect(result).toEqual(expectation)
  })
  it('Throws an error when too many segments are received', ({ expect }) => {
    const input = 'edibles/fruits/berries/blueberries'

    const errorSnapshot =
      "\"Received Component path with more than 3 segments: 'edibles/fruits/berries/blueberries'. Remove the extra segments. Expected format: '[Category]/[Folder]/[Page]'\""

    expect(() => parseComponentPath(input)).toThrowErrorMatchingInlineSnapshot(
      errorSnapshot
    )
  })
})
