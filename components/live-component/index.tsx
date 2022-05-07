import sg from '../shared.module.css'
import s from './style.module.css'
import { ReactElement, useState } from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import theme from '../../utils/editor-theme'
import createId from '../../utils/create-id'
import { useRestoreUrlState, setUrlState } from '../../utils/url-state'
import scrollToElement from '../../utils/scroll-to-element'

export default function createLiveComponent(
  scope: Record<string, ReactElement>
) {
  return function LiveComponent({
    children,
    components,
    collapsed = false,
  }: {
    children: string
    components: Record<string, ReactElement>
    collapsed: boolean
  }) {
    const id = createId(children)
    const componentName = Object.keys(scope)[0]
    const [code, setCode] = useState(children)
    const [isCollapsed, setIsCollapsed] = useState(collapsed)

    // restore saved state if present
    useRestoreUrlState((qs) => {
      if (qs.id == id) {
        setCode(qs.values)
        setTimeout(scrollToElement.bind(null, id), 100)
      }
    })

    return (
      <div className={s.liveComponent} id={id}>
        <div
          className={sg.save}
          onClick={() => setUrlState(componentName, id, code, true)}
        >
          Share
        </div>
        <LiveProvider
          code={code}
          scope={Object.assign({}, scope, components)}
          theme={theme}
          transformCode={(code) => {
            setCode(code)
            return code
          }}
        >
          <LivePreview />
          <h6
            className={`${sg.label} ${s.clickable}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            Code Editor
            <svg
              width="15"
              height="10.5"
              viewBox="0 0 10 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${s.caret} ${isCollapsed ? s.caretCollapsed : ''}`}
            >
              <path
                d="M8.05264 2L5.05264 5.00649L2.05264 2"
                stroke="#aaa"
                strokeWidth="1.25"
                strokeLinecap="square"
              ></path>
            </svg>
          </h6>
          <div className={`${s.editor} ${isCollapsed ? s.collapsed : ''}`}>
            <LiveEditor />
          </div>
          <LiveError />
        </LiveProvider>
      </div>
    )
  }
}
