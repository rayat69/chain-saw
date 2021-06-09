import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

export const useDarkmode = (key = 'rayat-portfolio-projects:dark') => {
  const localStorageKey = useMemo(() => key, [key])

  const [isDark, setIsDark] = useLocalStorage(localStorageKey, () => {
    if (!window.localStorage.getItem(localStorageKey)) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const toggle = useCallback(() => {
    setIsDark(prevMode => !prevMode)
  }, [setIsDark])

  return { isDark, toggle }
}
