import { useCallback, useState } from 'react'

import logo from '../images/logo.svg'

const NavBar = () => {
  const [navClassState, setNavClassState] = useState('')

  const toggleNav = useCallback(() => {
    setNavClassState(prev => {
      if (prev === 'responsive') {
        return ''
      }
      return 'responsive'
    })
  }, [])
  return (
    <nav>
      <div className="nav4">
        <div className="logo" id="logo">
          <img src={logo} alt="" />
        </div>
      </div>
      <div className="nav3">
        <div className="menu-icon" onClick={toggleNav}>
          <span className="fa fa-bars"></span>
        </div>
      </div>
      <div className={`nav1 ${navClassState}`} id="nav1">
        <div className="navs" id="navs">
          <a href="/">Features</a>
          <a href="/">Pricing</a>
          <a href="/">Resources</a>
        </div>
      </div>
      <div className={`nav2 ${navClassState}`} id="nav2">
        <div className="auth" id="auth">
          <a href="/">Login</a>
          <a href="/" className="signup">
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
