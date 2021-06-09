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
          maxWidth: '8.5in',
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
  const [editors, setEditors] = useState<Quill[] | []>([])
  const [isTypings, setIsTypings] = useState<boolean[] | []>([])
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

  const initializeEditor = useCallback(
    (wrapper: HTMLDivElement, toolbar: HTMLElement) => {
      const editor = document.createElement('div')
      wrapper.append(editor)

      const q = new Quill(editor, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbar,
          },
        },
      })
      q.disable()
      q.setText('Loading...')
      console.log('%cinitEditor!', 'color:orange')

      return q
    },
    []
  )

  // Initially load document
  useEffect(() => {
    if (!wrapperRef.current || !toolbarRef.current) {
      return
    }
    if (editors.length > 0) {
      return
    }

    if (!documentId) return
    ;(async () => {
      if (!wrapperRef.current || !toolbarRef.current) {
        return
      }
      if (editors.length > 0) {
        return
      }
      const snapshot = await documentRef.child(documentId).get()

      // let child: HTMLDivElement[]

      if (!snapshot.exists()) {
        const quill = initializeEditor(wrapperRef.current, toolbarRef.current)
        quill.setText('')
        quill.enable()

        setEditors([quill])
        setIsTypings([false])
        // child = [editorDiv]
      } else {
        const editors = snapshot.val()
        const editorsState = (editors as any[]).map(editor => {
          const quill = initializeEditor(
            wrapperRef.current!,
            toolbarRef.current!
          )
          quill.setContents(editor.content)
          quill.enable()
          return quill
        })
        // const quills = editorsState.map(m => m.quill)
        setEditors(editorsState)
        setIsTypings(Array.from(Array(editorsState.length).fill(false)))
        // quill.setContents(editors)
        console.log('main async')
      }
    })()
    // const ref = wrapperRef.current
    console.log(documentId, 'is is workingf?')

    // const tool = toolbarRef.current
    return () => {
      // ref.innerHTML = ''
      // ref.appendChild(tool)
      // const mamuRef = ref
      // mamuRef.childNodes.forEach((node, i) => {
      //   if (i === 0) {
      //     return
      //   }
      //   ref.removeChild(node)
      // })
      console.log('%cCleaned up editorsx', 'color:red')
    }
  }, [documentId, initializeEditor, wrapperRef, toolbarRef, editors])

  // Text change event
  useEffect(() => {
    if (editors.length === 0) return
    console.log('text-change-xxx', editors)

    const handler = (i: number): TextChangeHandler => {
      let timeout: NodeJS.Timeout
      // console.log(timeout)
      console.log('call-handlerg')

      // let timeout: NodeJS.Timeout
      // const cancelTimeout = () => clearTimeout(timeout)
      const callback: TextChangeHandler = async (delta, _, source) => {
        if (editors.length === 0) return
        if (source !== 'user') return
        // console.log(delta)

        console.log('user text-change callback xxx')
        if (!!timeout) {
          clearTimeout(timeout)
        }

        setIsTypings(prev => {
          if (prev[i]) {
            return prev
          }
          prev[i] = true

          return [...prev]
        })

        timeout = setTimeout(() => {
          setIsTypings(prev => {
            prev[i] = false

            return [...prev]
          })
          // console.log('typing stopped')
        }, 1500)
        // console.log('Timeout init', timeout)

        const newDelta = nullToZero({ ...delta })
        await documentRef
          .child(documentId)
          .child(i.toString())
          .child('delta')
          .update({ ...newDelta })

        console.log('change updated')
      }
      return callback
    }

    const unsubscribes = (editors as Quill[]).map((page, i) => {
      const subscribe = handler(i)
      console.log('added text-change event listener')

      const event = page.on('text-change', subscribe)
      return () => {
        event.off('text-change', subscribe)
      }
    })
    // console.log('quill-text-cng')

    return () => {
      unsubscribes.forEach(u => u())
    }
  }, [editors, documentId, nullToZero])

  // Realtime Content Receive
  useEffect(() => {
    if (editors.length === 0) return
    console.log('Debug:', editors)

    const listener =
      (page: Quill, idx: number) =>
      (snapshot: firebase.database.DataSnapshot) => {
        const content = snapshot.val()
        console.log('called for snapshot')

        setIsTypings(prev => {
          if (!prev[idx]) {
            const newDelta = page.updateContents(content, 'api')
            console.log('Delta added', newDelta)
          }
          return prev
        })
      }

    const unsubscribes = (editors as Quill[]).map((page, i) => {
      const subscribe = listener(page, i)
      const deltaDoc = documentRef
        .child(documentId)
        .child(i.toString())
        .child('delta')
      console.log('added shapshot event')

      const unmodified = deltaDoc.on('value', subscribe)

      return () => {
        deltaDoc.off('value', unmodified)
      }
    })

    return () => {
      unsubscribes.forEach(u => u())
    }
  }, [editors, documentId])

  // Save content
  useEffect(() => {
    if (editors.length === 0) return
    console.log('Debug:', editors)

    editors.forEach(async (page, i) => {
      if (isTypings[i]) {
        return
      }

      await documentRef
        .child(documentId)
        .child(i.toString())
        .child('content')
        .update(page.getContents())

      console.log('saved to db')
    })
    console.log('%cSave content', 'color:cyan')
  }, [editors, documentId, isTypings])

  useEffect(() => {
    if (!wrapperRef.current) {
      return
    }
    if (!toolbarRef.current) {
      return
    }
    if (editors.length === 0) {
      return
    }
    const wrapper = wrapperRef.current
    const toolbar = toolbarRef.current

    wrapper.childNodes.forEach((_, i) => {
      if (i === 0) {
        return
      }
      const childX = wrapper.children.item(i)
      if (!childX) {
        return
      }
      childX.classList.add(classes.editor)
    })
    toolbar.classList.add(classes.toolbar)
    return () => {
      wrapper.childNodes.forEach((_, i) => {
        if (i === 0) {
          return
        }
        const childX = wrapper.children.item(i)
        if (!childX) {
          return
        }
        childX.classList.remove(classes.editor)
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
