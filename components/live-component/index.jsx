import sg from '../shared.module.css'
import s from './style.module.css'
import { useState } from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import theme from '../../utils/editor-theme'
import createId from '../../utils/create-id'
import { useRestoreUrlState, setUrlState } from '../../utils/url-state'
import scrollToElement from '../../utils/scroll-to-element'

export default function createLiveComponent(scope) {
  return function LiveComponent({ children, components }) {
    const id = createId(children)
    const componentName = Object.keys(scope)[0]
    const [code, setCode] = useState(children)

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
          <h6 className={sg.label}>Code Editor</h6>
          <div className={s.editor}>
            <LiveEditor />
          </div>
          <LiveError />
        </LiveProvider>
      </div>
    )
  }
}
