import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: '#fefefe',
      paper: '#FaFaFa',
    },
  },
  typography: {
    overline: {
      fontWeight: 500,
      fontSize: '0.7rem',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          '& @media print': {
            background: 'none',
          },
        },
        code: {
          fontFamily: `source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
            monospace`,
        },
      },
    },
  },
})

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#202124',
      paper: '#535456',
    },
    text: {
      primary: '#E8EAED',
      secondary: '#FFFFFFDE',
    },
  },
  typography: {
    overline: {
      fontWeight: 500,
      fontSize: '0.7rem',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          '@media print': {
            background: 'none',
          },
        },
        code: {
          fontFamily: `source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
            monospace`,
        },
      },
    },
  },
})

const mainTheme = (dark: boolean) =>
  createMuiTheme({
    palette: {
      type: dark ? 'dark' : 'light',
    },
  })

export const light = responsiveFontSizes(lightTheme)
export const dark = responsiveFontSizes(darkTheme)
export const main = (dark: boolean) => responsiveFontSizes(mainTheme(dark))
