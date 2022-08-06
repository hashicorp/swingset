module.exports = {
  text: {
    control: 'text',
    defaultValue: 'button text',
    description: 'the text displayed by the button',
  },
  testObject: {
    description: 'test description yay',
    properties: {
      foo: {
        description: 'test description',
        properties: {
          bar: {
            description: 'deep nested yeahh',
          },
        },
      },
      baz: {
        description: 'a test array, nice',
        properties: [
          { description: 'any string value' },
          {
            description: 'an object value',
            properties: {
              quux: { description: 'object in an array' },
            },
          },
        ],
      },
    },
  },
  testObj2: {
    description: 'test obj with monotype array',
    properties: [
      {
        description: 'only a string is allowed',
      },
    ],
  },
}
