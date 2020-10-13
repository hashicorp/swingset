import s from './style.module.css'
import { Fragment } from 'react'

export default function PropsTable({ props }) {
  return (
    <table className={s.root}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{renderRows(props)}</tbody>
    </table>
  )
}

function renderRows(props, prefixes = []) {
  // console.log(props)
  const res = []
  if (Array.isArray(props)) {
    props.map((prop) => {
      // render the row for the current property
      res.push(renderRow('[x]', prop, prefixes, true))
      // render rows for sub-properties if they exist
      if (prop.properties)
        res.push(renderRows(prop.properties, [...prefixes, '[x]']))
    })
  } else {
    for (let key in props) {
      const value = props[key]
      // figure out whether the property of the current item is an array, and whether it has multiple valid types
      const arrayPropertyOptions =
        value.properties && value.properties.length
          ? value.properties.length > 1
            ? value.properties.length
            : 'single'
          : null
      // render the row given the information
      res.push(renderRow(key, value, prefixes, null, arrayPropertyOptions))
      // render rows for sub-properties if relevant
      if (value.properties)
        res.push(renderRows(value.properties, [...prefixes, key]))
    }
  }
  return res
}

function renderRow(key, value, prefixes, isArray, arrayOptions) {
  // this bunch of business is to ensure that object syntax chain are separated by periods,
  // but array syntax are not. like `foo.bar.baz` vs `foo[x].bar`
  // if the current item is an array syntax, we slice off the trailing period below
  const prefixSet = prefixes.reduce(
    (m, p, i) => `${m}${prefixes[i + 1]?.charAt(0) === '[' ? p : p + '.'}`,
    ''
  )
  return (
    <tr key={key}>
      <td>
        <code>
          {prefixes.length ? (
            <span className={s.prefix}>
              {isArray ? prefixSet.slice(0, -1) : prefixSet}
            </span>
          ) : (
            ''
          )}
          {key}
          {value.required ? <span className={s.required}>*</span> : ''}
          <div className={s.type}>{value.type}</div>
        </code>
      </td>
      <td>
        {value.description}
        {value.options && (
          <div className={s.options}>
            <strong>Options: </strong>
            {value.options.map((opt, idx) => (
              <Fragment key={opt}>
                <code>{JSON.stringify(opt)}</code>
                {idx < value.options.length - 1 && `, `}
              </Fragment>
            ))}
          </div>
        )}
        {value.itemType && (
          <div className={s.options}>
            <strong>Item Type: </strong>
            <code>{value.itemType}</code>
          </div>
        )}
        {value.properties && (
          <div className={s.containsNested}>
            {renderHelperText(arrayOptions)}
          </div>
        )}
      </td>
    </tr>
  )
}

function renderHelperText(arrayOptions) {
  if (typeof arrayOptions === 'number')
    return `Array can contain any of the ${arrayOptions} types below:`
  if (arrayOptions === 'single')
    return 'Array members must be of the type below:'
  return 'Object contains nested props, see below:'
}
