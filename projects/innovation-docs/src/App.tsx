import { Suspense, lazy } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  Router,
  NestedRoute,
  NestedRedirect,
  Route,
  Loading,
} from '@utils/components'
import { DarkModeProvider, useDark } from '@utils/context'
// import { Route } from 'react-router-dom'
import { nanoid } from 'nanoid'

import { dark, light } from './utils/theme'
// import { Switch, NestedRoute } from '../../hoc/withRouter'

const TextEditor = lazy(() => import('./components/TextEditor'))
const Document = lazy(() => import('./components/Document'))

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={light}>
        <CssBaseline />

        <Route exact path="/">
          <Suspense fallback={<Loading />}>
            <Document />
          </Suspense>
        </Route>
        <Route path="/docs">
          <NestedRoute path="/" exact>
            <NestedRedirect to={`/document:${nanoid(20)}`} />
          </NestedRoute>
          <NestedRoute path="/:docId">
            <DarkModeProvider>
              <MainThemeComponent />
            </DarkModeProvider>
          </NestedRoute>
        </Route>
      </ThemeProvider>
    </Router>
  )
}

const MainThemeComponent = () => {
  const { isDark } = useDark()

  return (
    <ThemeProvider theme={isDark ? dark : light}>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        <TextEditor />
      </Suspense>
    </ThemeProvider>
  )
}

export default App
