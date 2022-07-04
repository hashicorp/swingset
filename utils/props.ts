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
    if (!property.name) return acc

    if (isObjectProp(property)) {
      acc[property.name] = getTypeFromProperties(property)
      return acc
    }

    if (isArrayProp(property) && property.value) {
      acc[property.name] = property.value.map((prop) =>
        getTypeFromProperties(prop)
      )

      return acc
    }

    if (!hasValue(property)) return acc

    return {
      ...acc,
      [property.name]: property.value,
      type: property.type
        ? property.type
        : property.name === 'defaultValue'
        ? getTypeFromKind(property.kind)
        : null,
    }
  }, {} as Record<string, any>)
}

export function populateComponentPropsFromInterface(
  object: Record<string, PropType>,
  props: PropType[]
) {
  for (let property in object) {
    const iface = props.find((prop) => prop.name === property)

    if (iface) {
      object[property].type = getTypeFromKind(iface?.kind)
      if (!iface.optional) {
        // @ts-ignore
        object[property].required = true
      }

      // @ts-ignore
      if (object[property].properties && 'properties' in iface) {
        populateComponentPropsFromInterface(
          // @ts-ignore
          object[property].properties!,
          // @ts-ignore
          iface.properties ?? []
        )
      }
    } else {
      const propsWithNestedProperties: ObjectProp[] | ArrayProp[] =
        props.filter((p) => 'properties' in p)

      if (propsWithNestedProperties.length) {
        for (let i = 0; i < propsWithNestedProperties.length; i++) {
          populateComponentPropsFromInterface(
            // @ts-ignore
            object[property].properties!,
            propsWithNestedProperties[i].properties ?? []
          )
        }
      } else {
        object[property].type = getTypeFromKind(props[0].kind)
      }
    }
  }
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
