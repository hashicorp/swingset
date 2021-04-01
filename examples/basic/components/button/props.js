module.exports = {
  text: {
    control: 'text',
    type: 'string',
    defaultValue: 'button text',
    description: 'the text displayed by the button',
  },
  testObject: {
    type: 'object',
    description: 'test description yay',
    properties: {
      foo: {
        type: 'object',
        description: 'test description',
        properties: {
          bar: {
            type: 'string',
            description: 'deep nested yeahh',
          },
        },
      },
      baz: {
        type: 'array',
        description: 'a test array, nice',
        properties: [
          { type: 'string', description: 'any string value' },
          {
            type: 'object',
            description: 'an object value',
            properties: {
              quux: { type: 'string', description: 'object in an array' },
            },
          },
        ],
      },
    },
  },
  testObj2: {
    type: 'array',
    description: 'test obj with monotype array',
    properties: [
      {
        type: 'string',
        description: 'only a string is allowed',
      },
    ],
  },
}
