import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button, { ButtonProps } from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Slide from '@material-ui/core/Slide'
import Divider from '@material-ui/core/Divider'
import Backdrop from '@material-ui/core/Backdrop'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import { useEffect } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'

import { actionButton, drawerLink } from '../styles/navbar'
import useSwipe from '../hooks/useTouch'

const useStyles = makeStyles(
  theme => ({
    drawerPaper: {
      height: 'auto',
      width: 'auto',
      position: 'fixed',
      left: 0,
      right: 0,
      zIndex: theme.zIndex.appBar + 1,
      borderRadius: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
      margin: theme.spacing(4),
      marginTop: theme.spacing(10),
      touchAction: 'none',
      msTouchAction: 'none',
    }, //
    drawerLink: drawerLink(theme),
    actionButton: actionButton(theme),
    backdrop: {
      zIndex: theme.zIndex.appBar - 1,
      color: '#fff',
    },
  }),
  { classNamePrefix: 'sideBar' }
)

const SideBar: React.FC<SideBarProps> = ({ open, onClose }) => {
  const classes = useStyles()

  const [start, move, end] = useSwipe('right', 150, 200, onClose)

  useEffect(() => {
    if (!!open) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto'
    }

    return () => {
      document.body.style.overflowY = 'unset'
    }
  }, [open])
  return (
    <Backdrop open={open} onClick={onClose} className={classes.backdrop}>
      <Slide in={open} direction="left" mountOnEnter unmountOnExit>
        <Paper
          className={classes.drawerPaper}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        >
          <List>
            <DrawerItem onClick={onClose}>Features</DrawerItem>
            <DrawerItem onClick={onClose}>Pricing</DrawerItem>
            <DrawerItem onClick={onClose}>Resources</DrawerItem>
            <Divider color="#eee" variant="middle" />
            <DrawerItem onClick={onClose}>Login</DrawerItem>
            <DrawerItem
              variant="contained"
              onClick={onClose}
              className={classes.actionButton}
              color="primary"
            >
              Signup
            </DrawerItem>
          </List>
        </Paper>
      </Slide>
    </Backdrop>
  )
}

export default SideBar

interface SideBarProps {
  open: boolean
  onClose: () => void
}

export const DrawerItem: React.FC<DrawerItemProps> = ({
  className,
  ...props
}) => {
  const { drawerLink } = useStyles()
  return (
    <ListItem>
      <Button
        className={[drawerLink, className].join(' ')}
        fullWidth
        component={NavLink}
        to="/"
        {...props}
      />
    </ListItem>
  )
}

interface DrawerItemProps
  extends Omit<ButtonProps<typeof NavLink, NavLinkProps>, 'component' | 'to'> {}

export const SwipeableSideBar: React.FC<SideBarProps & { onOpen: () => void }> =
  ({ open, onClose, onOpen }) => {
    const classes = useStyles()
    return (
      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disableSwipeToOpen
        PaperProps={{ className: classes.drawerPaper }}
        BackdropProps={{ className: classes.backdrop }}
        style={{
          zIndex: 1099,
        }}
      >
        <List>
          <DrawerItem onClick={onClose}>Features</DrawerItem>
          <DrawerItem onClick={onClose}>Pricing</DrawerItem>
          <DrawerItem onClick={onClose}>Resources</DrawerItem>
          <Divider color="#eee" variant="middle" />
          <DrawerItem onClick={onClose}>Login</DrawerItem>
          <DrawerItem
            variant="contained"
            onClick={onClose}
            className={classes.actionButton}
            color="primary"
          >
            Signup
          </DrawerItem>
        </List>
      </SwipeableDrawer>
    )
  }
