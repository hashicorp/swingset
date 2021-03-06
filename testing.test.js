const { getTestValues } = require('./testing')

test('pulls base level values', () => {
  const res = getTestValues({
    base: {
      description: 'testing',
      default: 'default-value',
      testValue: 'test-value',
    },
    defaultNoTest: {
      description: 'testing 2',
      default: 'default-value',
    },
  })
  expect(res.base).toBe('test-value')
  expect(res.defaultNoTest).toBe('default-value')
})

test('pulls nested values', () => {
  const res = getTestValues({
    base: {
      properties: {
        foo: {
          type: 'string',
          testValue: 'nested',
        },
        bar: {
          type: 'string',
        },
      },
      testValue: { foo: 'base', bar: 'base' },
    },
  })
  expect(res.base.foo).toBe('nested')
  expect(res.base.bar).toBe('base')
})

test('nested values with an array containing a monotype', () => {
  const res = getTestValues({
    base: {
      properties: [
        {
          type: 'string',
          testValue: 'nested-string',
        },
      ],
    },
  })
  expect(res.base[0]).toBe('nested-string')
})

test('no test values used at all, when explicitly passing undefined', () => {
  const res = getTestValues({
    base: {
      properties: {
        array: {
          properties: [
            { type: 'object', properties: { foo: { type: 'string' } } },
          ],
        },
        object: {
          type: 'object',
          properties: {
            bar: {
              type: 'string',
            },
          },
        },
      },
      testValue: undefined,
    },
  })
  expect(res).toEqual({})
})

test('errors when a multi-type array has a test value at base and in properties', () => {
  expect(() => {
    getTestValues({
      base: {
        properties: [
          {
            type: 'string',
            testValue: 'nested-string',
          },
          {
            type: 'object',
          },
        ],
      },
    })
  }).toThrow(
    'Array properties with multiple possible types must define their test values at the base, but the prop "base" has defined "testValue" within one or more of its type options. Please remove the "testValue" from the following type options:\n\n=> {"type":"string","testValue":"nested-string"'
  )
})

test('type conflict between base and nested values', () => {
  expect(() =>
    getTestValues({
      base: {
        properties: {
          foo: {
            type: 'string',
            testValue: 'nested',
          },
          bar: {
            type: 'string',
          },
        },
        testValue: 'busted',
      },
    })
  ).toThrow(
    'The property "base" has a "properties" key, which requires an array or object type, but its "testValue" is "busted", which has a type of "string". Make sure that the types match'
  )
})

test('properties is not an array or object', () => {
  expect(() =>
    getTestValues({
      base: {
        properties: 'busted',
        testValue: 'foo',
      },
    })
  ).toThrow(
    'The "properties" key must be either an array or an object, but for the prop "base", its type is "string", and its value is "busted"'
  )
})

// It may be better to inject a default empty value for undefined types, but this
// adds a lot of code complexity, so passing on it for now - you cannot have nested values
// without a defined base value
test('sub-properties define test values but base property is undefined', () => {
  const res = getTestValues({
    base: {
      properties: {
        foo: {
          type: 'string',
          testValue: 'nested',
        },
      },
    },
  })
  expect(res).toEqual({ base: { foo: 'nested' } })
})
