import s from './style.module.css'
import marked from 'marked'
import { Fragment } from 'react'

export default function PropsTableTypescript({ props }) {
  return (
    <table className={s.root}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>{renderRows(props)}</tbody>
    </table>
  )
}

function renderRows(props, prefixes = []) {
  const res = []
  if (Array.isArray(props)) {
    props.map((prop) => {
      // render the row given the information
      res.push(renderRow(prop.name, prop, prefixes))
      // render rows for sub-properties if relevant
      if (prop.properties && prop.isObjectLike)
        res.push(renderRows(prop.properties, [...prefixes, prop.name]))
    })
  }
  return res
}

function renderRow(key, value, prefixes, arrayOptions) {
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
          {prefixes.length ? <span className={s.prefix}>{prefixSet}</span> : ''}
          {key}
          {!value.optional ? <span className={s.required}>*</span> : ''}
        </code>
        <div className={s.type}>{value.typeValue ?? value.type}</div>
      </td>
      <td className={s.descriptionCol}>
        <span
          dangerouslySetInnerHTML={{
            __html: marked.parseInline(value.description || ''),
          }}
        />
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
          <div className={s.containsNested}>{renderHelperText(value)}</div>
        )}
      </td>
      <td>{value.value && <code>{value.value}</code>}</td>
    </tr>
  )
}

function renderHelperText(value) {
  if (value.isObjectLike) return 'Object contains nested props, see below:'
  return ''
}
