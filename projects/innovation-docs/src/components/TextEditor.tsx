import { useEffect, useRef, useState, useCallback } from 'react'

import Quill, { RangeStatic, Delta, DeltaOperation } from 'quill'
import ReactQuill from 'react-quill'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import { Redirect } from '@utils/components'
import { useSocket } from '@utils/hooks'

import 'quill/dist/quill.snow.css'

import { Toolbar } from './Toolbar'
import { socketDev } from '../utils/constants'

const DeltaX = Quill.import('delta') as typeof Delta

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
          flexGrow: 1,
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
  const [value, setValue] = useState<Delta>(new DeltaX([]))
  const [events, setEvents] = useState<string[]>([])
  const [selection, setSelection] = useState<RangeStatic>()

  // Mui styled classes
  const classes = useStyles()

  // Socket hook
  useSocket(socketDev)

  // URL parameters for document ID
  const { docId: documentId } = useParams<{ docId: string }>()

  // Refs
  const wrapperRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const formatRange = useCallback(function formatRange(range?: RangeStatic) {
    return range ? [range.index, range.index + range.length].join(',') : 'none'
  }, [])

  const onEditorChange: Editor.ChangeEventHandler = useCallback(
    (_, delta, source, editor) => {
      if (source !== 'user') {
        return
      }

      socketDev.emit('quill-editor-send-changes-x', delta)
      setValue(editor.getContents())
      setEvents(prev => [`[${source}] text-change`, ...prev])
    },
    []
  )

  const onEditorChangeSelection: Editor.SelectionChangeEventHandler =
    useCallback(
      (range, source) => {
        if (source !== 'user') {
          return
        }
        setSelection(range)
        setEvents(prev => [
          `[${source}] selection-change(${formatRange(
            selection
          )} -> ${formatRange(range)})`,
          ...prev,
        ])
      },
      [formatRange, selection]
    )

  const onEditorFocus: Editor.FocusEventHandler = useCallback(
    (range, source) => {
      setEvents(prev => [`[${source}] focus(${formatRange(range)})`, ...prev])
    },
    [formatRange]
  )

  const onEditorBlur: Editor.FocusEventHandler = useCallback(
    (previousRange, source) => {
      setEvents(prev => [
        `[${source}] blur(${formatRange(previousRange)})`,
        ...prev,
      ])
    },
    [formatRange]
  )

  const socketBroadcast = useCallback((delta: DeltaOperation[]) => {
    setValue(prev => {
      const data = prev.compose(new DeltaX(delta))
      return data
    })
  }, [])

  useEffect(() => {
    socketDev.emit('quill-editor-get-document-x', documentId)
  }, [documentId])

  const editorRef = useCallback(
    (quill: ReactQuill) => {
      if (!quill) {
        return
      }

      socketDev.off(
        'quill-editor-receive-changes-x',
        socketDev.listeners('quill-editor-receive-changes-x')[0]
      )

      socketDev.on('quill-editor-receive-changes-x', socketBroadcast)
    },
    [socketBroadcast]
  )

  useEffect(() => {
    if (!toolbarRef.current) {
      return
    }
    const tool = toolbarRef.current

    tool.classList.add(classes.toolbar)
    return () => {
      tool.classList.remove(classes.toolbar)
    }
  }, [toolbarRef, classes.toolbar])

  if (!Editor.isRealId(documentId)) {
    return <Redirect to="/404" />
  }

  return (
    <div className={classes.container} id="container" ref={wrapperRef}>
      <Toolbar ref={toolbarRef} />
      <ReactQuill
        theme={'snow'}
        value={value}
        readOnly={false}
        onChange={onEditorChange}
        onChangeSelection={onEditorChangeSelection}
        onFocus={onEditorFocus}
        onBlur={onEditorBlur}
        className={classes.editor}
        id={documentId}
        modules={{ toolbar: { container: '#toolbar' } }}
        bounds="#container"
        ref={editorRef}
      />
    </div>
  )
}

export default TextEditor

namespace Editor {
  type QuillProps = ReactQuill['props']
  export type ChangeEventHandler = QuillProps['onChange']
  export type SelectionChangeEventHandler = QuillProps['onChangeSelection']
  export type BlurEventHandler = QuillProps['onBlur']
  export type FocusEventHandler = QuillProps['onFocus']

  export function isRealId(id: string) {
    if (id[8] !== ':') {
      return false
    }
    const [doc, mainId] = id.split(':')
    if (doc !== 'document') {
      return false
    }
    if (mainId.length !== 20) {
      return false
    }

    return true
  }
}
