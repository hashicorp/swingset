import path from 'path'
import { getStructuredPropsFromComponentFile } from '../props'

const getStructuredPropsFromFixture = (filename: string) =>
  getStructuredPropsFromComponentFile(
    path.join(__dirname, '__fixtures__', filename)
  )

describe('getStructuredPropsFromAST', () => {
  test('generates structure usable by the prop table component', () => {
    expect(getStructuredPropsFromFixture('component.tsx'))
      .toMatchInlineSnapshot(`
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

  test('generates structure from inline type declarations', () => {
    expect(getStructuredPropsFromFixture('inline-component.tsx'))
      .toMatchInlineSnapshot(`
Array [
  Object {
    "description": "Optional className to add to the root element.",
    "isObjectLike": false,
    "kind": 1,
    "name": "className",
    "optional": true,
    "type": "String",
    "typeValue": null,
  },
  Object {
    "description": "The type of message being displayed, which mainly affects coloration. Defaults to \\"info\\".",
    "isObjectLike": false,
    "kind": 4,
    "name": "type",
    "optional": true,
    "properties": Array [
      Object {
        "isObjectLike": false,
        "kind": 1,
        "type": "String",
        "typeValue": "info",
        "value": "info",
      },
      Object {
        "isObjectLike": false,
        "kind": 1,
        "type": "String",
        "typeValue": "success",
        "value": "success",
      },
      Object {
        "isObjectLike": false,
        "kind": 1,
        "type": "String",
        "typeValue": "warning",
        "value": "warning",
      },
      Object {
        "isObjectLike": false,
        "kind": 1,
        "type": "String",
        "typeValue": "danger",
        "value": "danger",
      },
    ],
    "type": "Union",
    "typeValue": "info | success | warning | danger",
    "value": "info",
  },
]
`)
  })

  test('generates structure for arrays with complex objects', () => {
    expect(getStructuredPropsFromFixture('array-object.tsx'))
      .toMatchInlineSnapshot(`
Array [
  Object {
    "isObjectLike": false,
    "kind": 16,
    "name": "links",
    "parent": Object {
      "name": "Props",
    },
    "properties": Array [
      Object {
        "isObjectLike": true,
        "kind": 15,
        "properties": Array [
          Object {
            "isObjectLike": false,
            "kind": 1,
            "name": "text",
            "type": "String",
            "typeValue": null,
          },
          Object {
            "isObjectLike": false,
            "kind": 1,
            "name": "url",
            "type": "String",
            "typeValue": null,
          },
        ],
        "type": "Object",
        "typeValue": null,
      },
    ],
    "type": "Array",
    "typeValue": null,
  },
]
`)
  })

  test('generates structure for referenced union types', () => {
    expect(getStructuredPropsFromFixture('union-type.tsx'))
      .toMatchInlineSnapshot(`
Array [
  Object {
    "isObjectLike": false,
    "kind": 4,
    "name": "product",
    "parent": Object {
      "name": "Props",
    },
    "properties": Array [
      Object {
        "isObjectLike": false,
        "kind": 1,
        "type": "String",
        "typeValue": "boundary",
        "value": "boundary",
      },
      Object {
        "isObjectLike": false,
        "kind": 1,
        "type": "String",
        "typeValue": "waypoint",
        "value": "waypoint",
      },
      Object {
        "isObjectLike": false,
        "kind": 1,
        "type": "String",
        "typeValue": "nomad",
        "value": "nomad",
      },
    ],
    "type": "Products",
    "typeValue": "boundary | waypoint | nomad",
  },
]
`)
  })

  test.only('generates props for components with additional properties', () => {
    expect(
getStructuredPropsFromFixture('with-property.tsx')).
toMatchInlineSnapshot(`
Array [
  Object {
    "isObjectLike": false,
    "kind": 1,
    "name": "text",
    "parent": Object {
      "name": "Props",
    },
    "type": "String",
    "typeValue": null,
  },
  Object {
    "isObjectLike": false,
    "kind": 1,
    "name": "url",
    "parent": Object {
      "name": "Props",
    },
    "type": "String",
    "typeValue": null,
  },
]
`)
  })
})
