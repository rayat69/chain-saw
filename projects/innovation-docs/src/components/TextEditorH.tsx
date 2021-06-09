import { useEffect, useRef, useState, useCallback } from 'react'

import Quill, { DeltaStatic, TextChangeHandler } from 'quill'
import { nanoid } from 'nanoid'
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
  // const [initialData, setInitialData] = useState<Delta[]>([])
  // const [loaded, setLoaded] = useState(false)
  const [editorState, setEditorState] = useState({
    typing: false,
    saved: false,
  })
  // const [docLoaded, setDocLoaded] = useState(false)
  // Mui styled classes
  const classes = useStyles()

  // URL parameters for document ID
  const { docId: documentId } = useParams<{ docId: string }>()

  // Refs
  const wrapperRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const textChangeHandler = useCallback((idx: number): TextChangeHandler => {
    let timeout: NodeJS.Timeout
    const callback: TextChangeHandler = (delta, _, source) => {
      if (source !== 'user') return

      if (!!timeout) {
        clearTimeout(timeout)
      }

      setEditorState(prev => {
        if (prev.saved && !prev.typing) {
          return { saved: false, typing: true }
        } else if (prev.saved) {
          return { ...prev, saved: false }
        } else if (!prev.typing) {
          return { ...prev, typing: true }
        }
        return prev
      })

      socketDev.emit('quill-editor-send-changes', delta, idx)

      timeout = setTimeout(() => {
        setEditorState(prev => ({ ...prev, typing: false }))
      }, SAVE_INTERVAL_MS - 500)
    }
    return callback
  }, [])

  const initializeQuill = useCallback(
    (
      wrapper: HTMLDivElement,
      toolbar: HTMLDivElement,
      content: DeltaStatic,
      idx: number
    ) => {
      const editor = document.createElement('div')
      editor.id = nanoid(5)
      wrapper.append(editor)

      const q = new Quill(editor, {
        theme: 'snow',
        // modules: { toolbar: TOOLBAR_OPTIONS },
        modules: { toolbar: { container: toolbar } },
        placeholder: 'Write innovation...',
      })
      q.disable()
      q.setContents(content)
      q.enable()

      const handler = textChangeHandler(idx)
      q.on('text-change', handler)
      // console.log('mamu')

      return { quill: q, handler }
    },
    [textChangeHandler]
  )

  // Send document id, load document and initialize quill
  useEffect(() => {
    console.log('Loading 1')

    if (!socketDev) return

    if (!wrapperRef.current || !toolbarRef.current) {
      return
    }
    if (!!editors) {
      return
    }
    console.log('Loading 2')

    const loader = (documents: DeltaStatic[]) => {
      if (!wrapperRef.current || !toolbarRef.current) {
        return
      }

      console.log(documents)

      const initors = documents.map((document, index) => {
        return initializeQuill(
          wrapperRef.current!,
          toolbarRef.current!,
          document,
          index
        )
      })

      setEditors(prev =>
        initors.map((initor, i) => {
          if (!!prev) {
            prev[i].off('text-change', initor.handler)
            console.log('Previous cleaned')
          }
          return initor.quill
        })
      )
    }

    socketDev.once('quill-editor-load-document', loader)
    console.log('Loading 3')

    socketDev.emit('quill-editor-get-document', documentId)

    // const wrapper = wrapperRef.current
    // const toolbar = toolbarRef.current

    return () => {
      // wrapper.innerHTML = ''
      // wrapper.appendChild(toolbar)
      socketDev.off('quill-editor-load-document', loader)
    }
  }, [documentId, initializeQuill, wrapperRef, toolbarRef, editors])

  // Save document
  useEffect(() => {
    if (!socketDev || !editors || editors.length === 0) return
    // ;(() => {
    if (editorState.typing || editorState.saved) {
      return
    }
    const contents = editors.map(editor => editor.getContents())
    socketDev.emit('quill-editor-save-document', contents)
    console.log('Saving 2:xxx', contents)
    setEditorState(prev => ({ ...prev, saved: true }))
    // })()
  }, [editors, editorState.saved, editorState.typing])

  // Recieve changes
  useEffect(() => {
    if (!socketDev || !editors || editors.length === 0) return

    const handler = (delta: DeltaStatic, index: number) => {
      editors[index].updateContents(delta, 'api')
    }
    socketDev.on('quill-editor-receive-changes', handler)

    return () => {
      socketDev.off('quill-editor-receive-changes', handler)
    }
  }, [editors])

  // Text change event
  // useEffect(() => {
  //   if (!socketDev || !editors || editors.length === 0) return

  //   const handler = (idx: number): TextChangeHandler => {
  //     let timeout: NodeJS.Timeout
  //     const callback: TextChangeHandler = (delta, _, source) => {
  //       if (source !== 'user') return

  //       if (!!timeout) {
  //         clearTimeout(timeout)
  //       }

  //       setEditorState(prev => {
  //         if (prev.saved && !prev.typing) {
  //           return { saved: false, typing: true }
  //         } else if (prev.saved) {
  //           return { ...prev, saved: false }
  //         } else if (!prev.typing) {
  //           return { ...prev, typing: true }
  //         }
  //         return prev
  //       })

  //       socketDev.emit('quill-editor-send-changes', delta, idx)

  //       timeout = setTimeout(() => {
  //         setEditorState(prev => ({ ...prev, typing: false }))
  //       }, SAVE_INTERVAL_MS - 500)
  //     }
  //     return callback
  //   }
  //   const cleaners = editors.map((editor, index) => {
  //     const subscribe = handler(index)
  //     editor.on('text-change', subscribe)

  //     const clean = () => editor.off('text-change', subscribe)

  //     return clean
  //   })

  //   const unsubscribe = () => cleaners.forEach(c => c())
  //   console.log('mamu')

  //   return unsubscribe
  // }, [editors])

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
