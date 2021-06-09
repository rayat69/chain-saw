import {
  fade,
  lighten,
  Theme,
} from '@material-ui/core/styles'

interface Css extends React.CSSProperties {
  [k: string]: any | React.CSSProperties
}

type StylesFn = (theme: Theme) => Css
// type Styles = Css

const whiteText: React.CSSProperties['color'] = '#fafafa'

export const navLink: StylesFn = theme => ({
    color: theme.palette.text.secondary,
    fontWeight: 'bold',
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeInOut,
    }),
    '&:hover': {
      color: theme.palette.text.primary,
      backgroundColor: fade(
        theme.palette.text.secondary,
        theme.palette.action.hoverOpacity
      ),
    },
  }),
  actionButton: StylesFn = theme => ({
    color: whiteText,
    borderRadius: 999,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: lighten(theme.palette.primary.main, 0.4),
    },
  }),
  drawerLink: StylesFn = theme => ({
    color: whiteText,
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: fade(whiteText, theme.palette.action.hoverOpacity),
    },
  })
