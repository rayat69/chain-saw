import Article from './components/Article'
import Footer from './components/Footer'
import Header from './components/Header'
import Main from './components/Main'
// import NavBar from './components/NavBar'
import PrimarySearchAppBar from './components/NavBarX'
import Section from './components/Section'
import { LinksProvider } from './context/links'
import { Router, Route } from '@utils/components'

import './css/main.scss'

function App() {
  return (
    <>
      <Router>
        <Route path="/">
          <PrimarySearchAppBar />
          <div className="shit">
            <LinksProvider>
              {/* <NavBar /> */}
              <Header />
              <Main />
              <Section />
            </LinksProvider>
          </div>
          <Article />
          <Footer />
        </Route>
      </Router>
    </>
  )
}

export default App
