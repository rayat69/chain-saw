import { forwardRef } from 'react'
import IconButton from '@material-ui/core/IconButton'
import DarkIcon from '@material-ui/icons/Brightness4Outlined'
import LightIcon from '@material-ui/icons/Brightness5Outlined'

import { useDark } from '@utils/context'
import { TOOLBAR_OPTIONS } from '../utils/constants'
import Tools from './Tools'

export const Toolbar = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { isDark, toggle } = useDark()
  return (
    <div ref={ref} id="toolbar" {...props}>
      <Tools options={TOOLBAR_OPTIONS} />
      <IconButton
        aria-label="toggle dark theme"
        aria-controls="menu"
        size="medium"
        id="custom-button"
        onClick={toggle}
      >
        {isDark ? <LightIcon /> : <DarkIcon />}
      </IconButton>
    </div>
  )
})
