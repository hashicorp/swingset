import { describe, it } from 'vitest'
import { parseComponentPath } from '../src/parse-component-path'

describe('parseComponentPath', () => {
  it('converts the front matter string to an object', ({ expect }) => {
    const expectation = {
      category: 'Components',
      folder: 'Forms',
      page: 'Input',
    }

    const result = parseComponentPath('Components/Forms/Input')

    expect(result).toEqual(expectation)
  })
  it('converts the front matter string to an object', ({ expect }) => {
    const expectation = {
      category: 'Components',
      page: 'Button',
    }

    const result = parseComponentPath('Components/Button')

    expect(result).toEqual(expectation)
  })
  it('converts the front matter string to an object', ({ expect }) => {
    const expectation = {
      page: 'Button',
    }

    const result = parseComponentPath('Button')

    expect(result).toEqual(expectation)
  })
})
