import React, { useState, useEffect } from 'react'

function parseLocalData<V extends unknown>(value: V): string {
  if (value instanceof Function) {
    return JSON.stringify(value())
  }
  if (typeof value !== 'string') {
    return JSON.stringify(value)
  }
  return value
}

const useLocalStorage: UseLocalStorage = (key, value) => {
  const [task, setTask] = useState(() => {
    if (value instanceof Function) {
      return value()
    }
    return value
  })

  useEffect(() => {
    const data = window.localStorage.getItem(key)
    if (!data) return

    setTask(JSON.parse(data) as typeof task)
  }, [key])

  useEffect(() => {
    window.localStorage.setItem(key, parseLocalData(task))
  }, [task, key])

  return [task, setTask]
}

export { useLocalStorage }

export type UseLocalStorage = <V>(
  key: string,
  value: V | (() => V)
) => [V, React.Dispatch<React.SetStateAction<V>>]
