function getTestValues(propsSpec) {
  return Object.keys(propsSpec).reduce((memo, name) => {
    const prop = propsSpec[name]
    const intendedValue = prop.testValue || prop.default

    // if there is a test value or default provided, set it on the props' name
    if (intendedValue) memo[name] = intendedValue

    // if there are nested properties, we recurse and override any sub-properties
    // that provide their own test values
    if (prop.properties) {
      if (Array.isArray(prop.properties)) {
        // if properties is an array, we have a number of hedges to make
        // first, we will only recurse to pull `testValues` if its a monotype array
        if (prop.properties.length === 1) {
          // here we pass it in as a fake object then extract the result and add it to an array
          const nestedTestValues = getTestValues({
            arrayItem: prop.properties[0],
          }).arrayItem
          if (nestedTestValues) memo[name] = [nestedTestValues]
        } else {
          const subPropsWithTestValues = prop.properties.filter(
            (subProp) => !!subProp.testValue
          )
          if (subPropsWithTestValues.length) {
            throw new Error(
              `Array properties with multiple possible types must define their test values at the base, but the prop "${name}" has defined "testValue" within one or more of its type options. Please remove the "testValue" from the following type options:\n\n${subPropsWithTestValues
                .map((x) => `=> ${JSON.stringify(x)}`)
                .join('\n')}`
            )
          }
        }
      } else if (typeof prop.properties === 'object') {
        // if properties is an object, and the `testValue` is also an object,
        // we can recurse and assign the results directly
        if (typeof memo[name] === 'object') {
          Object.assign(memo[name], getTestValues(prop.properties))
        } else if (typeof memo[name] === 'undefined') {
          // do nothing, there is no test value and thats ok
        } else {
          throw new Error(
            `The property "${name}" has a "properties" key, which requires an array or object type, but its "testValue" is ${JSON.stringify(
              memo[name]
            )}, which has a type of "${typeof memo[
              name
            ]}". Make sure that the types match.`
          )
        }
      } else {
        throw new Error(
          `The "properties" key must be either an array or an object, but for the prop "${name}", its type is "${typeof prop.properties}", and its value is "${
            prop.properties
          }"`
        )
      }
    }

    return memo
  }, {})
}

module.exports.getTestValues = getTestValues
