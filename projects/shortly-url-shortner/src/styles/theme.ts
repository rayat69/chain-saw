import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { cyan, purple, red, grey } from '@material-ui/core/colors'

const breakpointValues = {
  xs: 0,
  sm: 512,
  md: 768,
  lg: 992,
  xl: 1440,
} as const
// const breakpoints= ['xs', 'sm', 'md', 'lg', 'xl'] as const

const lightTheme = createMuiTheme(
  {
    palette: {
      primary: { ...cyan, main: 'hsl(180, 66%, 49%)' },
      secondary: { ...purple, main: 'hsl(257, 27%, 26%)' },
      error: { ...red, main: 'hsl(0, 87%, 67%)' },
      // grey: { ...grey, '400': 'hsl(0, 0%, 75%)' },
      text: {
        primary: 'hsl(255, 11%, 22%)',
        secondary: 'hsl(0, 0%, 75%)',
        hint: 'hsl(257, 7%, 63%)',
        disabled: 'hsl(260, 8%, 14%)',
      },
    },
    typography: {
      h1: {
        fontSize: '3rem',
        fontWeight: 700,
        lineHeight: '60px',
        color: 'hsl(255, 11%, 22%)',
      },
      subtitle1: {
        fontSize: 18,
        color: 'hsl(0, 0%, 75%)',
      },
      h2: {
        color: 'hsl(260, 8%, 14%)',
        textAlign: 'center',
      },
      subtitle2: {
        color: grey[600],
        textAlign: 'center',
        width: '40%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      h3: {
        color: 'hsl(255, 11%, 22%)',
      },
    },
    breakpoints: {
      values: breakpointValues,
    },
  },
  { mamu: 'hsl(255, 11%, 22%)' }
)

export const light = responsiveFontSizes(lightTheme, {
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
  variants: ['h1', 'h2', 'h3', 'subtitle1', 'subtitle2'],
  disableAlign: true,
})
