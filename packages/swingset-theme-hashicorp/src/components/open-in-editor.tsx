'use client'

export function OpenInEditor({ path }: { path: string }) {
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <button
      className="ss-border ss-border-gray-200 hover:ss-bg-gray-100 ss-text-gray-600 ss-py-2 ss-px-3 ss-rounded ss-font-bold ss-text-sm ss-shadow-gray-100 ss-shadow-sm"
      onClick={() => fetch(`/__nextjs_launch-editor?file=${path}`)}
    >
      open in editor
    </button>
  )
}
