import { StrictMode } from 'react'
import { render } from 'react-dom'
import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles'

import './index.css'
import App from './App'

const className = createGenerateClassName({
  productionPrefix: 'iDocs-',
})

const Main = () => {
  if (process.env.NODE_ENV === 'production') {
    return (
      <StrictMode>
        <StylesProvider generateClassName={className}>
          <App />
        </StylesProvider>
      </StrictMode>
    )
  }
  return (
    <StylesProvider generateClassName={className}>
      <App />
    </StylesProvider>
  )
}

render(<Main />, document.getElementById('root'))
