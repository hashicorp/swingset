'use client'
//Once this page starts to get built, make this can be server component again
export default function Index() {
  if (typeof window !== 'undefined') {
    window.location.replace('https://swingset-example.vercel.app/swingset')
  }

  return <h1>Hello world</h1>
}
