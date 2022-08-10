import {
  BaseFunctionProp,
  isArrayProp,
  ObjectProp,
  PropKind,
  PropType,
  PropTypes,
  isObjectLikeProp,
  parseFiles,
} from '@structured-types/api'
import reactPlugin from '@structured-types/react-plugin'

type StructuredProp = PropType & {
  isObjectLike: boolean
  typeValue?: string | null
  properties?: StructuredProp[]
}

/**
 * Extract props information from a TypeScript component source file
 */
export function getStructuredPropsFromComponentFile(filePath: string) {
  // generate an AST from the Props.ts file
  const ast = parseFiles([filePath], {
    plugins: [reactPlugin],
  })

  return getStructuredPropsFromAST(ast)
}

/**
 * Decorates the properties of the default export using `getStructuredPropsFromProperties`.
 *
 * Accepts an AST generated from `@structured-types/api`.
 */
export function getStructuredPropsFromAST(ast: PropTypes) {
  const defaultExport = ast.default as BaseFunctionProp
  const properties = (defaultExport as ObjectProp).properties ?? []

  return getStructuredPropsFromProperties(properties)
}

/**
 * Decorates the data structure returned from `@structured-types/api` with additional properties to
 * render in Swingset's prop table
 */
export function getStructuredPropsFromProperties(properties: PropType[]) {
  if (!properties || properties.length === 0) return []

  return properties.map((node) => {
    const result: StructuredProp = {
      ...node,
      isObjectLike: isObjectLikeProp(node),
      type: node.type ?? getTypeFromKind(node.kind),
    }

    if (result.properties) {
      result.properties = getStructuredPropsFromProperties(result.properties)
    }

    result.typeValue = generateTypeValue(result)

    return result
  }) as StructuredProp[]
}

/**
 * Generates a human-readable value for the type, for use in our prop table component
 */
function generateTypeValue(prop: StructuredProp) {
  if (prop.type === 'Union') {
    return prop?.properties?.map((p) => p.type).join(' | ')
  }

  // Generate a readable type value for arrays, e.g. for string: `string[]`
  if (isArrayProp(prop) && prop.properties) {
    return `(${prop?.properties?.[0]?.typeValue ?? prop.properties[0].type})[]`
  }

  // Generate a readable type value for tuples, e.g. [string, number]
  if (prop.type === 'Tuple' && prop.properties) {
    return `[${prop.properties.map((p) => p.type).join(', ')}]`
  }

  return null
}

function getTypeFromKind(kind?: PropKind) {
  if (!kind) return PropKind[PropKind.Unknown]

  if (kind === PropKind.Type) return PropKind[PropKind.Object]

  return PropKind[kind]
}
