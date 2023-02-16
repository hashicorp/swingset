import Link from 'next/link'
import data from 'swingset/__component-data'

export default function SwingsetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <h1>Hello from Swingset</h1>
        {Object.entries(data).map(([slug, d]) => (
          <>
            <Link href={`/swingset/${d.slug}`}>{d.slug}</Link>&nbsp;
          </>
        ))}
        {children}
      </body>
    </html>
  )
}
