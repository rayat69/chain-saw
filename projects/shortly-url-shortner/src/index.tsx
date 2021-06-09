import { StrictMode } from 'react'
import { render } from 'react-dom'
import {
  ThemeProvider,
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
// import './index.css';
import App from './App'
import { light } from './styles/theme'

const className = createGenerateClassName({
  productionPrefix: 'shortly-',
})

render(
  <StrictMode>
    <ThemeProvider theme={light}>
      <CssBaseline />
      <StylesProvider generateClassName={className}>
        <App />
      </StylesProvider>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root')
)
