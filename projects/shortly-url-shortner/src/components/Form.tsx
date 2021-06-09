import { useCallback, useState, useMemo } from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import OutlinedInput from '@material-ui/core/OutlinedInput'
// import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { useMediaQuery } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { nanoid } from 'nanoid'

import shortenDesktop from '../images/bg-shorten-desktop.svg'
import { urlResolver } from '../utils/validator'
// import { useLinks } from '../context/links'
import { shortUrlRef } from '../utils/firebase'
import { ShortURL } from '../utils/shortUrl'

const useStyles = makeStyles(
  theme => ({
    paper: {
      backgroundImage: `url(${shortenDesktop})`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#3b3054',
      // display: 'flex',
      // alignItems: 'center',
      // justifyContent: 'center',
      borderRadius: theme.spacing(2),
      padding: theme.spacing(4),
      [theme.breakpoints.up('md')]: {
        height: 130,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    input: {
      backgroundColor: '#fafafa',
      fontSize: 18,
      transition: theme.transitions.create('border', {
        duration: theme.transitions.duration.standard,
        easing: theme.transitions.easing.easeInOut,
      }),
      '&$inputError': {
        '& $notchedOutline': {
          borderColor: theme.palette.error.main,
          borderWidth: 2,
        },
      },
      '&$focused': {
        '& $notchedOutline': {
          border: 'none',
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
          borderStyle: 'solid',
        },
      },
      '&:hover': {
        '& $notchedOutline': {
          border: 'none',
        },
      },
    },
    notchedOutline: {},
    focused: {},
    inputError: {},
    button: {
      height: '100%',
    },
    error: {
      color: theme.palette.error.main,
      textDecoration: 'bold',
      fontStyle: 'italic',
      fontSize: 16,
      [theme.breakpoints.up('md')]: {
        position: 'absolute',
        bottom: '-45%',
        left: '-2%',
      },
    },
  }),
  { classNamePrefix: 'shortnerForm' }
)

const Form = () => {
  const classes = useStyles()
  const defaultFormValue = useMemo(
    () => ({
      fullUrl: '',
    }),
    []
  )
  // const { setLinks } = useLinks()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValue,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: urlResolver,
  })

  const isMd = useMediaQuery(
    (theme: Theme) => `(min-width:${theme.breakpoints.values.md}px)`
  )

  const submitLink: SubmitHandler<typeof defaultFormValue> = useCallback(
    async data => {
      // setIsLoading(true)
      try {
        setIsLoading(true)
        const id = nanoid(6)
        const urlData = new ShortURL(data.fullUrl, 'user:mamu')
        // await urlCol.doc(id).set(urlData)

        await shortUrlRef.child(id).set(urlData)

        console.log('id: ', id)
        reset({ fullUrl: '' })
      } catch (error) {
        console.log(error.message)
      } finally {
        setIsLoading(false)
      }
    },
    [reset]
  )

  return (
    <Paper className={classes.paper}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="stretch"
        spacing={2}
        component="form"
      >
        <Grid item xs={12} md={9}>
          <FormControl
            size={isMd ? 'medium' : 'small'}
            fullWidth
            variant="outlined"
            inputMode="url"
          >
            <OutlinedInput
              type="url"
              name="fullUrl"
              placeholder="Shorten a link here.."
              autoComplete="off"
              // inputRef={register}
              inputProps={{ ...register('fullUrl') }}
              fullWidth
              inputMode="url"
              classes={{
                focused: classes.focused,
                notchedOutline: classes.notchedOutline,
                root: classes.input,
                error: classes.inputError,
              }}
              error={!!errors.fullUrl}
            />
            <FormHelperText
              component={ErrorMessage}
              as={FormHelperText}
              className={classes.error}
              name="fullUrl"
              variant="outlined"
              errors={errors}
              error={!!errors.fullUrl}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            fullWidth
            onClick={handleSubmit(submitLink)}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <CircularProgress color="primary" size={isMd ? 40 : 30} />
            ) : (
              'Shorten It!'
            )}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Form
