import { useEffect, useRef, useState, useCallback } from 'react'

import Quill, { TextChangeHandler } from 'quill'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
// import { database } from '@utils/common/dist/firebase'
import firebase from 'firebase'

import 'quill/dist/quill.snow.css'

import { documentRef } from '../utils/constants'
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
  const [isTyping, setIsTyping] = useState(false)
  // const [isSaved, setIsSaved] = useState(false)
  const classes = useStyles()

  const { docId: documentId } = useParams<{ docId: string }>()

  const wrapperRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const nullToZero = useCallback((j: any) => {
    for (const i in j) {
      if (j[i] instanceof Object) {
        nullToZero(j[i])
      }
      if (j[i] instanceof Array) {
        j[i].forEach((element: any) => {
          nullToZero(element)
        })
      }
      if (j[i] === null) {
        j[i] = 0
      }
    }
    return j
  }, [])

  const zeroToNull = useCallback((j: any) => {
    for (const i in j) {
      if (j[i] instanceof Object) {
        zeroToNull(j[i])
      }
      if (j[i] instanceof Array) {
        j[i].forEach((element: any) => {
          zeroToNull(element)
        })
      }
      if (j[i] === 0) {
        j[i] = null
      }
    }
    return j
  }, [])

  // Initially load document
  useEffect(() => {
    if (!quill) return

    if (!documentId) return
    ;(async () => {
      const snapshot = await documentRef
        .child(documentId)
        .child('content')
        .get()

      quill.enable()
      if (!snapshot.exists()) {
        quill.setText('')
      } else {
        const content = snapshot.val()
        quill.setContents(content)
      }
    })()
  }, [quill, documentId])

  // Text change event
  useEffect(() => {
    if (!quill) return
    let timeout: NodeJS.Timeout
    const handler: TextChangeHandler = async (delta, _, source) => {
      if (source === 'api') {
        // console.log(delta)
      }
      if (source !== 'user') return
      // console.log(delta)

      if (!!timeout) {
        clearTimeout(timeout)
      }

      setIsTyping(prev => {
        if (prev) {
          return prev
        }
        return !prev
      })
      // setIsSaved(prev => {
      //   if (!prev) {
      //     return prev
      //   }
      //   return !prev
      // })

      timeout = setTimeout(() => {
        setIsTyping(false)
      }, 1500)

      const newDelta = nullToZero({ ...delta })
      await documentRef
        .child(documentId)
        .child('delta')
        .update({ ...newDelta })

      console.log({ ...newDelta })
    }
    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [quill, documentId, nullToZero])

  useEffect(() => {
    if (!quill) return

    const listener = (snapshot: firebase.database.DataSnapshot) => {
      const content = snapshot.val()
      setIsTyping(prev => {
        if (prev) {
          return prev
        }

        const newDelta = quill.updateContents(content)
        console.log('Snapshot:', newDelta)

        return prev
      })
    }

    documentRef.child(documentId).child('delta').on('value', listener)

    return () => {
      documentRef.child(documentId).child('delta').off('value', listener)
    }
  }, [quill, documentId])

  // Save every 2 seconds
  useEffect(() => {
    if (!quill) return
    ;(async () => {
      // setIsSaved(prevSaved => {
      // if (isSaved || isTyping) {
      //   return
      // }
      if (isTyping) {
        return
      }
      await documentRef
        .child(documentId)
        .child('content')
        .update(quill.getContents())
      //   return true
      // setIsSaved(true)
      // setIsTyping(false)
      // })
    })()

    // return () => {
    //   clearInterval(save)
    // }
  }, [quill, documentId, isTyping])

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
  }, [wrapperRef, toolbarRef])

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
