import { ComponentType, ReactNode } from 'react'

interface PropsTableProps {
  component: ComponentType & { propsMetadata: any }
}

function TableData({ children }: { children: ReactNode }) {
  return <td className="ss-border-b ss-py-2 ss-px-1">{children}</td>
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="ss-font-mono ss-p-1 ss-rounded-md ss-border ss-border-gray-300 ss-text-sm ss-bg-gray-50 ss-shadow-sm">
      {children}
    </code>
  )
}

export function PropsTable({ component }: PropsTableProps) {
  console.log(component.propsMetadata)
  const headers = ['Name', 'Type', 'Description', 'Required']
  const rows = Object.entries(component.propsMetadata.props).map(
    ([key, data]: [string, any]) => (
      <tr key={key}>
        <TableData>{key}</TableData>
        <TableData>
          <InlineCode>{data.tsType?.name}</InlineCode>
        </TableData>
        <TableData>{data.description ?? '-'}</TableData>
        <TableData>
          <InlineCode>{String(data.required)}</InlineCode>
        </TableData>
      </tr>
    )
  )

  return (
    <table className="ss-table-auto ss-w-full ss-border-collapse ss-my-4">
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="ss-text-left ss-px-1 ss-py-2 ss-border-b-2 ss-bg-gray-50"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{rows.map((row) => row)}</tbody>
    </table>
  )
}
