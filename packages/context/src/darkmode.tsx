import React, { createContext, useContext } from 'react'
import { useDarkmode } from '@utils/hooks'

const DarkModeContext = createContext({
  isDark: false,
  toggle: () => {},
})

export const useDark = () => useContext(DarkModeContext)

export const DarkModeProvider: React.FC = ({ children }) => {
  const { isDark, toggle } = useDarkmode('innovation-docs:dark')
  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  )
}
