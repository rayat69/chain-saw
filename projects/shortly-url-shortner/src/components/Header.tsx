import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

import illustrationWorking from '../images/illustration-working.svg'
import { actionButton } from '../styles/navbar'

const useStyles = makeStyles(theme => ({
  actionButton: actionButton(theme),
}))

const Header = () => {
  const classes = useStyles()
  return (
    <header>
      <main>
        <div className="title">
          <h1>More than just shorter links</h1>
        </div>
        <div className="desc">
          <p>
            Build your brand's recognition and get detailed insights on how your
            links are performing.
          </p>
        </div>
        <div className="get-started">
          <Button
            variant="contained"
            component={Link}
            to="/"
            className={classes.actionButton}
          >
            Get Started
          </Button>
          {/* <a href="/">Get Started</a> */}
        </div>
      </main>
      <aside>
        <div className="illustration">
          <img src={illustrationWorking} alt="Illustration" />
        </div>
      </aside>
    </header>
  )
}

export default Header
