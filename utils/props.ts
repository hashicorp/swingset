import {
  ArrayProp,
  hasValue,
  isArrayProp,
  isObjectProp,
  ObjectProp,
  PropKind,
  PropType,
} from '@structured-types/api'

function getTypeFromKind(kind?: PropKind) {
  if (!kind) return PropKind[PropKind.Unknown]

  if (kind === PropKind.Type) return PropKind[PropKind.Object]

  return PropKind[kind]
}

function getTypeFromProperties(prop: ObjectProp | ArrayProp) {
  const propertiesProp: ObjectProp | ArrayProp | undefined =
    prop.properties?.find((p) => p.name === 'properties')

  if (propertiesProp) {
    if ('properties' in propertiesProp) {
      return {
        ...getValues(prop),
        type: getTypeFromKind(propertiesProp.kind),
        properties: getValues(propertiesProp),
      }
    }
    return {
      ...getValues(prop),
      type: getTypeFromKind(propertiesProp.kind),
    }
  }

  return getValues(prop)
}

function getValues(prop: ObjectProp | ArrayProp): Record<string, any> | null {
  if (!prop) return null

  if (!prop.properties?.length) {
    return null
  }

  return prop.properties?.reduce((acc, property) => {
    if (!property.name) {
      return {
        ...prop,
        properties: prop.properties?.map((property) => ({
          type: getTypeFromKind(property.kind),
          required: !property.optional,
        })),
      }
    }

    if (isArrayProp(property) && property.value) {
      acc[property.name] = property.value.map((prop) =>
        getTypeFromProperties(prop)
      )

      return acc
    } else if ('properties' in property) {
      acc[property.name] = getTypeFromProperties(property)
      return acc
    }

    if (!hasValue(property)) return acc

    return {
      ...acc,
      [property.name]: property.value ?? null,
      description: property.description ?? null,
      required: !property.optional,
      type: property.type
        ? property.type
        : property.name === 'defaultValue'
        ? getTypeFromKind(property.kind)
        : null,
    }
  }, {} as Record<string, any>)
}

export function populateComponentPropsFromInterface(
  componentProps: Record<string, any>,
  props: PropType[]
) {
  props.forEach((prop) => {
    if (!prop.name) return

    if (
      (isObjectProp(prop) || isArrayProp(prop)) &&
      prop.properties?.some((p) => p.name === 'properties')
    ) {
      componentProps[prop.name] = getTypeFromProperties(prop)
      populateComponentPropsFromInterface(
        componentProps[prop.name],
        prop.properties
      )
    } else {
      const values = getValues(prop)
      componentProps[prop.name] = {
        properties: values ? values : null,
        description: prop.description ?? null,
        required: !prop.optional,
        type: getTypeFromKind(prop.kind),
      }
    }
  })
}

export function populateComponentPropsFromDefaultValues(
  acc: Record<string, any>,
  rootKeys: PropType[]
) {
  rootKeys.forEach((root) => {
    if (!root.name || !isObjectProp(root)) return

    if (root.properties?.some((prop) => prop.name === 'properties')) {
      acc[root.name] = getTypeFromProperties(root)

      populateComponentPropsFromDefaultValues(acc[root.name], root.properties)
    } else if (isObjectProp(root) || isArrayProp(root)) {
      acc[root.name] = getValues(root)
      const defaultValue = root.properties?.find(
        (prop) => prop.name === 'defaultValue'
      )

      if (defaultValue) {
        acc[root.name].type = getTypeFromKind(defaultValue.kind)
      }

      if (root.type) {
        acc[root.name].type = root.type
      }
    }
  })
}
