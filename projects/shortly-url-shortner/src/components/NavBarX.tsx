import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import {
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import { useState } from 'react'

import logo from '../images/logo.svg'
import { NavLink } from 'react-router-dom'
import { SwipeableSideBar } from './SideBar'
import { actionButton, navLink } from '../styles/navbar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    }, //
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        gap: theme.spacing(2),
      },
      [theme.breakpoints.up('lg')]: {
        gap: theme.spacing(3),
      },
    }, //
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    }, //
    toolbar: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      justifyContent: 'space-between',
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
      },
      [theme.breakpoints.up('md')]: {
        paddingLeft: theme.spacing(12),
        paddingRight: theme.spacing(12),
      },
    }, //
    drawer: {
      padding: theme.spacing(4),
      paddingTop: theme.spacing(8),
    }, //
    drawerPaper: {
      height: 'auto',
      width: 'auto',
      position: 'unset',
      borderRadius: theme.spacing(1),
      backgroundColor: 'hsl(257, 27%, 26%)',
      margin: theme.spacing(4),
      marginTop: theme.spacing(2),
    }, //
    navLink: navLink(theme),
    actionButton: actionButton(theme),
  })
)

export default function PrimarySearchAppBar() {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeSideBar = () => {
    setDrawerOpen(false)
  }
  const openSideBar = () => {
    setDrawerOpen(true)
  }

  const toggleSideBar = () => {
    setDrawerOpen(prev => !prev)
  }

  const mobileMenuId = 'primary-search-account-menu-mobile'

  return (
    <>
      {/* <div className={classes.grow}> */}
      <AppBar position="relative" color="inherit">
        <Toolbar className={classes.toolbar}>
          <img src={logo} alt="Logo" />
          <div className={classes.sectionDesktop}>
            <Button className={classes.navLink} component={NavLink} to="/">
              Features
            </Button>
            <Button className={classes.navLink} component={NavLink} to="/">
              Pricing
            </Button>
            <Button className={classes.navLink} component={NavLink} to="/">
              Resources
            </Button>
          </div>
          <div className={classes.sectionDesktop}>
            <Button className={classes.navLink} component={NavLink} to="/">
              Login
            </Button>
            <Button
              color="primary"
              variant="contained"
              component={NavLink}
              to="/"
              className={classes.actionButton}
            >
              Signup
            </Button>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              edge="end"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={toggleSideBar}
            >
              {!drawerOpen ? <MenuIcon fontSize='large'/> : <CloseIcon fontSize='large' />}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {/* <SideBar open={drawerOpen} onClose={closeSideBar} /> */}
      <SwipeableSideBar
        open={drawerOpen}
        onClose={closeSideBar}
        onOpen={openSideBar}
      />
    </>
  )
}
