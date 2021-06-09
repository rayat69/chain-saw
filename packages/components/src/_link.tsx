import React from 'react'
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  LinkProps as RouterLinkProps,
  NavLinkProps as NavRouterLinkProps,
} from 'react-router-dom'
import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'

const useLinkStyles = makeStyles(
  theme => ({
    link: {
      textTransform: (props: CustomLinkProps) =>
        !!props.uppercase ? 'uppercase' : 'none',
      '&:hover': {
        color: (props: CustomLinkProps) =>
          theme.palette[props.hoverColor || 'secondary'].main,
      },
    },
  }),
  { classNamePrefix: 'customLink' }
)
const useNavLinkStyles = makeStyles(
  theme => ({
    navLink: {
      textTransform: (props: CustomNavLinkProps) =>
        !!props.uppercase ? 'uppercase' : 'none',
      '&:hover': {
        color: (props: CustomNavLinkProps) =>
          theme.palette[props.hoverColor || 'secondary'].main,
      },
      '&.active': {
        color: (props: CustomNavLinkProps) =>
          theme.palette[props.activeColor || 'primary'].main,
      },
    },
  }),
  { classNamePrefix: 'customNavLink' }
)

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const { link } = useLinkStyles({
      uppercase: props.uppercase,
      hoverColor: props.hoverColor,
    })
    return (
      <MuiLink
        ref={ref}
        className={link}
        color="textPrimary"
        underline="none"
        component={RouterLink}
        {...props}
      />
    )
  }
)

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  (props, ref) => {
    const { navLink } = useNavLinkStyles({
      uppercase: props.uppercase,
      activeColor: props.activeColor,
      hoverColor: props.hoverColor,
    })
    return (
      <MuiLink
        ref={ref}
        className={navLink}
        color="textPrimary"
        underline="none"
        component={RouterNavLink}
        {...props}
      />
    )
  }
)

interface CustomLinkProps {
  uppercase?: boolean
  hoverColor?: 'primary' | 'secondary' | 'success' | 'info' | 'error'
}
interface CustomNavLinkProps extends CustomLinkProps {
  activeColor?: 'primary' | 'secondary' | 'success' | 'info' | 'error'
}

export interface LinkProps
  extends Omit<MuiLinkProps<RouterLink, RouterLinkProps>, 'component'>,
    CustomLinkProps {}

export interface NavLinkProps
  extends Omit<MuiLinkProps<RouterNavLink, NavRouterLinkProps>, 'component'>,
    CustomNavLinkProps {}
