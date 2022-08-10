import path from 'path'
import { parseFiles } from '@structured-types/api'
import { getStructuredPropsFromAST } from '../props'
import reactPlugin from '@structured-types/react-plugin'

const fixture = parseFiles(
  [path.join(__dirname, '__fixtures__', 'component.tsx')],
  { plugins: [reactPlugin] }
)

describe('getStructuredPropsFromAST', () => {
  test('generates structure usable by the prop table component', () => {
    expect(getStructuredPropsFromAST(fixture)).toMatchInlineSnapshot(`
Array [
  Object {
    "description": "nested is a NestedObject",
    "isObjectLike": true,
    "kind": 14,
    "name": "nested",
    "properties": Array [
      Object {
        "isObjectLike": true,
        "kind": 15,
        "name": "foo",
        "parent": Object {
          "name": "NestedObject",
        },
        "properties": Array [
          Object {
            "description": "I am a description",
            "isObjectLike": false,
            "kind": 1,
            "name": "bar",
            "type": "String",
            "typeValue": null,
          },
        ],
        "type": "Object",
        "typeValue": null,
      },
    ],
    "type": "NestedObject",
    "typeValue": null,
  },
  Object {
    "description": "I am optional",
    "isObjectLike": false,
    "kind": 1,
    "name": "baz",
    "optional": true,
    "parent": Object {
      "name": "Props",
    },
    "type": "String",
    "typeValue": null,
    "value": "baz",
  },
  Object {
    "isObjectLike": false,
    "kind": 16,
    "name": "alpha",
    "parent": Object {
      "name": "Props",
    },
    "properties": Array [
      Object {
        "isObjectLike": false,
        "kind": 1,
        "type": "String",
        "typeValue": null,
      },
    ],
    "type": "Array",
    "typeValue": "(String)[]",
  },
  Object {
    "isObjectLike": false,
    "kind": 6,
    "name": "beta",
    "parent": Object {
      "name": "Props",
    },
    "properties": Array [
      Object {
        "isObjectLike": false,
        "kind": 1,
        "type": "String",
        "typeValue": null,
      },
      Object {
        "isObjectLike": false,
        "kind": 2,
        "type": "Number",
        "typeValue": null,
      },
    ],
    "type": "Tuple",
    "typeValue": "[String, Number]",
  },
]
`)
  })
})
