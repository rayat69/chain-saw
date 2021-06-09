import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Document = () => {
  const [mamu, setMamu] = useState(1)
  useEffect(() => {
    console.log('%cEffect 1', 'color:cyan')
    return () => {
      console.log('%cCleanup 1', 'color:green')
    }
  }, [mamu])
  useEffect(() => {
    console.log('%cEffect 3', 'color:cyan')
    return () => {
      console.log('%cCleanup 3', 'color:green')
    }
  }, [mamu])
  useEffect(() => {
    console.log('%cEffect 2', 'color:cyan')
    return () => {
      console.log('%cCleanup 2', 'color:green')
    }
  }, [mamu])

  useEffect(() => {
    console.log('Free effect')
  }, [])
  return (
    <div>
      <h2>Hello to Documents</h2>
      <Link to={`/docs/document:${nanoid(20)}`}>New Document</Link>
      <button onClick={() => setMamu(prev => prev + 1)}>MAMU</button>
    </div>
  )
}

export default Document
