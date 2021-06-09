import { useEffect, useRef, useState } from 'react'

import Quill, { TextChangeHandler } from 'quill'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'

import 'quill/dist/quill.snow.css'

import { SAVE_INTERVAL_MS, socket } from '../utils/constants'
import { Toolbar } from './Toolbar'

const useStyles = makeStyles(
  theme => {
    const { active } = theme.palette.action,
      { paper } = theme.palette.background,
      important = (value: string | number) =>
        typeof value === 'number'
          ? `${value}px !important`
          : `${value} !important`

    return {
      '@global': {
        '.ql-snow': {
          '& .ql-picker': {
            color: important(theme.palette.text.primary),
          },
          '& .ql-stroke': {
            stroke: important(active),
          },
          '& .ql-fill': {
            fill: important(active),
          },
          '& .ql-picker-options': {
            backgroundColor: important(theme.palette.background.default),
          },
        },
      },
      toolbar: {
        backgroundColor: paper,
      },
      editor: {
        '& .ql-editor': {
          backgroundColor: paper,
        },
      },
      container: {
        '& .ql-editor': {
          width: '8.5in',
          minHeight: '11in',
          padding: '1in',
          margin: '1rem',
          boxShadow: '0 0 10px 5px rgba(0, 0, 0, 0.5)',
          /* background-color: #eee; */
          '@media print': {
            width: '6.5in',
            height: '9in',
            padding: 0,
            margin: 0,
            boxShadow: 'none',
            alignSelf: 'flex-start',
          },
        },
        '& .ql-container.ql-snow': {
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
        },
        '& .ql-toolbar.ql-snow': {
          display: 'flex',
          justifyContent: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          /* background-color: #f3f3f3, */
          border: 'none',
          boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.5)',
          '@media print': {
            display: 'none',
          },
        },
      },
    }
  },
  { classNamePrefix: 'iDoc' }
)

const TextEditor = () => {
  const [quill, setQuill] = useState<Quill>()
  const classes = useStyles()

  const { docId: documentId } = useParams<{ docId: string }>()

  const wrapperRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Send document id and load document
  useEffect(() => {
    if (!socket || !quill) return

    socket.once('quill-editor-load-document', (document: any) => {
      quill.enable()
      quill.setContents(document)
    })

    socket.emit('quill-editor-get-document', documentId)
  }, [quill, documentId])

  // Save document every 2 seconds
  useEffect(() => {
    if (!socket || !quill) return

    const interval = setInterval(() => {
      socket.emit('quill-editor-save-document', quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [quill])

  // Recieve changes
  useEffect(() => {
    if (!socket || !quill) return

    const handler = (delta: any) => {
      quill.updateContents(delta)
    }
    socket.on('quill-editor-receive-changes', handler)

    return () => {
      socket.off('quill-editor-receive-changes', handler)
    }
  }, [quill])

  // Text change event
  useEffect(() => {
    if (!quill) return
    const handler: TextChangeHandler = (delta, _, source) => {
      if (source !== 'user') return
      socket.emit('quill-editor-send-changes', delta)
    }
    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [quill])

  // Initialize Quill
  useEffect(() => {
    if (!wrapperRef.current) {
      return
    }
    if (!toolbarRef.current) {
      return
    }
    // if (!!quill) {
    //   return
    // }
    const editor = document.createElement('div')
    wrapperRef.current.append(editor)
    const q = new Quill(editor, {
      theme: 'snow',
      // modules: { toolbar: TOOLBAR_OPTIONS },
      modules: { toolbar: { container: toolbarRef.current } },
    })
    q.disable()
    q.setText('Loading...')

    setQuill(q)

    // toolbarRef.current.classList.add(classes.toolbar)
    // wrapperRef.current.classList.add(classes.editor)

    const ref = wrapperRef.current
    // const tool = toolbarRef.current
    return () => {
      // ref.innerHTML = ''
      // ref.appendChild(tool)
      ref.removeChild(editor)
    }
  }, [])

  useEffect(() => {
    if (!wrapperRef.current) {
      return
    }
    if (!toolbarRef.current) {
      return
    }
    if (!quill) {
      return
    }
    const wrapper = wrapperRef.current
    const toolbar = toolbarRef.current

    wrapper.lastElementChild?.classList.add(classes.editor)
    toolbar.classList.add(classes.toolbar)
    return () => {
      wrapper.lastElementChild?.classList.remove(classes.editor)
      toolbar.classList.remove(classes.toolbar)
    }
  }, [quill, classes.editor, classes.toolbar])

  return (
    <div className={classes.container} id="container" ref={wrapperRef}>
      <Toolbar ref={toolbarRef} />
    </div>
  )
}

export default TextEditor
