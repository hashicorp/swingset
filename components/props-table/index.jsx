import s from './style.module.css'
import { Fragment } from 'react'

const permittedKeys = [
  'description',
  'type',
  'control',
  'options',
  'defaultValue',
  'required',
]

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

function renderRows(props, prefix) {
  const res = []
  // let's start by looping through the props object
  for (let key in props) {
    const value = props[key]

    // we know which standard keys are expected -- when there are non-standard keys, this is an indication that
    // we likely have a nested prop
    const nonStandardKeys = Object.keys(props[key]).filter(
      (k) => !permittedKeys.includes(k)
    )
    const hasNestedProps = !props[key].control && nonStandardKeys.length > 0

    // warn the user if they have included keys in the props object that are non-standard
    if (props[key].control && nonStandardKeys.length > 0) {
      console.warn(
        `The prop object for "${key}" contains non-standard keys: ${JSON.stringify(
          nonStandardKeys
        )}. Allowed keys are: ${JSON.stringify(permittedKeys)}`
      )
    }

    // render the row given the information
    res.push(renderRow(key, value, hasNestedProps, prefix))

    // if we have a row that contains nested props, we need to render more rows
    if (hasNestedProps) {
      // first let's remove the permitted keys since we already rendered these, to leave only
      // the top-level nested props
      const nestedPropsCopy = JSON.parse(JSON.stringify(props[key]))
      permittedKeys.map((k) => delete nestedPropsCopy[k])

      // now we recurse with the rest of the props
      res.push(renderRows(nestedPropsCopy, { key, value }))
    }
  }

  return res
}

function renderRow(key, value, hasNestedProps, prefix) {
  return (
    <tr key={key}>
      <td>
        <code>
          {prefix ? (
            <span className={s.prefix}>
              {prefix.key}
              {prefix.value.type.toLowerCase() === 'array' ? '[n].' : '.'}
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
        {hasNestedProps && value.type.toLowerCase() === 'object' && (
          <div className={s.containsNested}>
            Contains nested props, see below:
          </div>
        )}
        {hasNestedProps && value.type.toLowerCase() === 'array' && (
          <div className={s.containsNested}>
            Each array item is an object with the props below:
          </div>
        )}
      </td>
    </tr>
  )
}
