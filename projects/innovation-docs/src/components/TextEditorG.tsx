import { useEffect, useRef, useState, useCallback } from 'react'

import Quill, { DeltaStatic, TextChangeHandler } from 'quill'
import Delta from 'quill-delta'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'

import 'quill/dist/quill.snow.css'

import { SAVE_INTERVAL_MS, socketDev } from '../utils/constants'
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
          maxWidth: '8.5in',
          height: '11in',
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
          alignItems: 'stretch',
          flexDirection: 'column',
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
  const [editors, setEditors] = useState<Quill[]>()
  // const [isTyping, setIsTyping] = useState(false)
  const [initialData, setInitialData] = useState<DeltaStatic[]>([])
  const [loaded, setLoaded] = useState(false)
  const [editorState, setEditorState] = useState({
    typing: false,
    saved: false,
  })
  const [docLoaded, setDocLoaded] = useState(false)

  // Mui styled classes
  const classes = useStyles()

  // URL parameters for document ID
  const { docId: documentId } = useParams<{ docId: string }>()

  // Refs
  const wrapperRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const initializeQuill = useCallback(
    (wrapper: HTMLDivElement, toolbar: HTMLDivElement, content?: DeltaStatic) => {
      const editor = document.createElement('div')
      wrapper.innerHTML = ''
      wrapper.appendChild(toolbar)
      wrapper.append(editor)
      const q = new Quill(editor, {
        theme: 'snow',
        // modules: { toolbar: TOOLBAR_OPTIONS },
        modules: { toolbar: { container: toolbar } },
        placeholder: 'Write innovation...',
      })
      q.disable()
      if (!!content) {
        q.setContents(content)
      } else {
        q.setText('')
      }
      q.enable()
      return q
    },
    []
  )

  // Send document id and load document
  useEffect(() => {
    if (!socketDev) return

    socketDev.once('quill-editor-load-document', (documents: DeltaStatic[]) => {
      setInitialData(documents)
      setLoaded(true)
      console.log(documents)
    })

    socketDev.emit('quill-editor-get-document', documentId)
  }, [documentId])

  // Save document every 2 seconds
  useEffect(() => {
    if (!socketDev || !editors || editors.length === 0) return
    console.log('Saving 1')

    // const interval = setInterval(() => {
    //   const contents = editors.map(editor => editor.getContents())
    //   socketDev.emit('quill-editor-save-document', contents)
    //   console.log('Saving 2:', contents)
    // }, SAVE_INTERVAL_MS)
    ;(() => {
      if (editorState.typing || editorState.saved) {
        return
      }
      const contents = editors.map(editor => editor.getContents())
      socketDev.emit('quill-editor-save-document', contents)
      console.log('Saving 2:', contents)
      setEditorState(prev => ({ ...prev, saved: true }))
    })()

    // return () => {
    //   // clearInterval(interval)
    // }
  }, [editors, editorState])

  // Recieve changes
  useEffect(() => {
    if (!socketDev || !editors || editors.length === 0) return

    const handler = (delta: DeltaStatic, index: number) => {
      editors[index].updateContents(delta)
      setInitialData(prev => {
        prev[index] = delta
        return [...prev]
      })
    }
    socketDev.on('quill-editor-receive-changes', handler)

    return () => {
      socketDev.off('quill-editor-receive-changes', handler)
    }
  }, [editors])

  // Text change event
  useEffect(() => {
    if (!socketDev || !editors || editors.length === 0) return

    const handler = (idx: number): TextChangeHandler => {
      let timeout: NodeJS.Timeout
      return (delta, _, source) => {
        if (source !== 'user') return
        console.log('typing', timeout)

        if (!!timeout) {
          clearTimeout(timeout)
        }

        setEditorState(prev => {
          if (prev.saved && !prev.typing) {
            return { saved: false, typing: true }
          }
          if (prev.saved) {
            return { ...prev, saved: false }
          }
          if (!prev.typing) {
            return { ...prev, typing: true }
          }
          return prev
        })

        socketDev.emit('quill-editor-send-changes', delta, idx)

        timeout = setTimeout(() => {
          setEditorState(prev => ({ ...prev, typing: false }))
        }, SAVE_INTERVAL_MS - 500)
        console.log('Set timeout', timeout)
      }
    }
    const unsubscribe = editors.map((editor, index) => {
      const subscribe = handler(index)
      const event = editor.on('text-change', subscribe)

      return () => {
        event.off('text-change', subscribe)
      }
    })

    return () => {
      unsubscribe.forEach(u => u())
    }
  }, [editors])

  // Initialize Quill
  useEffect(() => {
    if (!wrapperRef.current) {
      return
    }
    if (!toolbarRef.current) {
      return
    }
    if (!loaded || docLoaded) {
      return
    }
    // if (!!quill) {
    //   return
    // }

    let quills: Quill[] = [
      initializeQuill(wrapperRef.current!, toolbarRef.current!),
    ]

    if (!initialData || initialData.length === 0) {
      quills = quills
    }
    if (initialData instanceof Array) {
      quills = initialData.map(delta =>
        initializeQuill(wrapperRef.current!, toolbarRef.current!, delta)
      )
    }

    setEditors(quills)
    setDocLoaded(true)

    const ref = wrapperRef.current
    const tool = toolbarRef.current
    console.log('gas')

    return () => {
      // if (!docLoaded) {
      //   return
      // }
      // ref.innerHTML = ''
      // ref.appendChild(tool)
      // ref.childNodes.forEach((node, i) => {
      //   if (i === 0) {
      //     return
      //   }
      //   ref.removeChild(node)
      // })
    }
  }, [initialData, initializeQuill, wrapperRef, toolbarRef, loaded, docLoaded])

  useEffect(() => {
    if (!wrapperRef.current) {
      return
    }
    if (!toolbarRef.current) {
      return
    }
    if (!editors || editors.length === 0) {
      return
    }
    const wrapper = wrapperRef.current
    const toolbar = toolbarRef.current

    wrapper.childNodes.forEach((child, i) => {
      if (i === 0) {
        return
      }
      ;(child as HTMLDivElement).classList.add(classes.editor)
    })
    toolbar.classList.add(classes.toolbar)
    return () => {
      wrapper.childNodes.forEach((child, i) => {
        if (i === 0) {
          return
        }
        ;(child as HTMLDivElement).classList.remove(classes.editor)
      })
      toolbar.classList.remove(classes.toolbar)
    }
  }, [editors, classes.editor, classes.toolbar])

  return (
    <div className={classes.container} id="container" ref={wrapperRef}>
      <Toolbar ref={toolbarRef} />
    </div>
  )
}

export default TextEditor
