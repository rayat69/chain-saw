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
          height: '11in',
          padding: '1in',
          margin: '1rem',
          boxShadow: '0 0 10px 5px rgba(0, 0, 0, 0.5)',
          overflowY: 'hidden',
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
          alignItems: 'center',
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
      console.log(delta)

      if (source !== 'user') return

      if (!!timeout) {
        clearTimeout(timeout)
      }

      setIsTyping(prev => {
        if (prev) {
          return prev
        }
        return !prev
      })

      timeout = setTimeout(() => {
        setIsTyping(false)
      }, 1500)

      const newDelta = nullToZero({ ...delta })
      await documentRef
        .child(documentId)
        .child('delta')
        .update({ ...newDelta })
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

        quill.updateContents(content)

        return prev
      })
    }

    documentRef.child(documentId).child('delta').on('value', listener)

    return () => {
      documentRef.child(documentId).child('delta').off('value', listener)
    }
  }, [quill, documentId])

  // Save content
  useEffect(() => {
    if (!quill) return
    ;(async () => {
      if (isTyping) {
        return
      }
      await documentRef
        .child(documentId)
        .child('content')
        .update(quill.getContents())
    })()
  }, [quill, documentId, isTyping])

  // Initialize Quill
  useEffect(() => {
    if (!wrapperRef.current) {
      return
    }
    if (!toolbarRef.current) {
      return
    }

    const editor = document.createElement('div')
    wrapperRef.current.append(editor)

    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: {
          container: toolbarRef.current,
        },
      },
      placeholder: 'Write your dreams...',
    })
    q.disable()
    q.setText('Loading...')

    function createNewPage(this: HTMLDivElement) {
      const overflowing = this.scrollHeight > this.clientHeight
      console.log('pointer moving')
      if (overflowing) {
        const a = document.createElement('div')
        const newCont = q.addContainer(a) as HTMLDivElement
        newCont.contentEditable = 'true'
        newCont.classList.add('ql-editor')
        //
        // const b = window.getSelection()!
        // // b.collapse(a, 0)
        // b.collapseToStart()
        //

        this.blur()
        this.classList.remove('focused')
        newCont.addEventListener('focus', _ => {
          console.log('Item is focused')
        })
        newCont.focus()
        newCont.classList.add('focused')

        const sel = window.getSelection()!

        sel.collapse(newCont, 0)
        console.log(sel.focusNode)

        newCont.addEventListener('input', createNewPage)
        this.removeEventListener('input', createNewPage)
      }
    }
    function createNewPageX(elem: HTMLDivElement, observer: MutationObserver) {
      const overflowing = elem.scrollHeight > elem.clientHeight
      console.log('pointer moving')
      if (overflowing) {
        const a = document.createElement('div')
        const newCont = q.addContainer(a) as HTMLDivElement
        newCont.contentEditable = 'true'
        newCont.classList.add('ql-editor')
        newCont.dataset.gramm = 'false'
        //
        // const b = window.getSelection()!
        // // b.collapse(a, 0)
        // b.collapseToStart()
        //

        elem.blur()
        elem.classList.remove('focused')
        observer.disconnect()
        newCont.addEventListener('focus', _ => {
          console.log('Item is focused')
        })
        newCont.focus()
        newCont.classList.add('focused')

        const sel = window.getSelection()!

        sel.collapse(newCont, 0)
        console.log(sel.focusNode)

        const observerX = new MutationObserver(function (
          mutationsList,
          observerY
        ) {
          const elem = mutationsList[0].target as HTMLDivElement
          const overflowing = elem.scrollHeight > elem.clientHeight
          console.log('pointer moving', overflowing)
          if (overflowing) {
            createNewPageY(elem, observerY)
          }
        })
        observerX.observe(newCont, {
          characterData: false,
          childList: true,
          attributes: false,
        })
      }
    }
    function createNewPageY(elem: HTMLDivElement, observer: MutationObserver) {
      if (!wrapperRef.current) {
        return
      }
      const editor = document.createElement('div')
      wrapperRef.current.append(editor)

      const qx = new Quill(editor, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarRef.current,
          },
        },
        placeholder: 'Write your dreams...',
      })

      qx.on('text-change', delta => {
        console.log(delta)
      })

      elem.blur()
      elem.classList.remove('focused')
      observer.disconnect()
      ;(editor.firstElementChild as HTMLDivElement)!.addEventListener(
        'focus',
        _ => {
          console.log('Item is focused')
        }
      )
      ;(editor.firstElementChild as HTMLDivElement)!.focus()
      ;(editor.firstElementChild as HTMLDivElement)!.classList.add('focused')

      const sel = window.getSelection()!

      sel.collapse(editor.firstElementChild, 0)
      console.log(sel.focusNode)

      const observerX = new MutationObserver(function (
        mutationsList,
        observerY
      ) {
        const elem = mutationsList[0].target as HTMLDivElement
        const overflowing = elem.scrollHeight > elem.clientHeight
        console.log('pointer moving', overflowing)
        if (overflowing) {
          createNewPageY(elem, observerY)
        }
      })
      observerX.observe(editor.firstElementChild!, {
        characterData: false,
        childList: true,
        attributes: false,
      })
    }
    // const a = document.createElement('div')
    // // a.addEventListener('input', createNewPage)
    // const newCont = q.addContainer(a) as HTMLDivElement
    // newCont.contentEditable = 'true'
    // newCont.classList.add('ql-editor')
    // newCont.focus()
    // newCont.classList.add('focused')
    // console.log(editor.firstElementChild)
    // ;(editor.firstElementChild as HTMLDivElement)!.addEventListener(
    //   'change',
    //   createNewPage
    // )

    const observer = new MutationObserver(function (mutationsList, observer) {
      const elem = mutationsList[0].target as HTMLDivElement
      const overflowing = elem.scrollHeight > elem.clientHeight
      console.log('pointer moving', overflowing)
      if (overflowing) {
        createNewPageY(elem, observer)
      }
    })
    observer.observe(editor.firstElementChild!, {
      characterData: false,
      childList: true,
      attributes: false,
    })
    // console.log(newCont)

    setQuill(q)

    const ref = wrapperRef.current
    return () => {
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
