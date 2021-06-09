import React, { useMemo } from 'react'
import { STATUS_CODES } from 'http'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { Head } from './_head'

export const statusCodes = {
  400: STATUS_CODES[400]!,
  401: STATUS_CODES[401]!,
  403: STATUS_CODES[403]!,
  404: 'This page could not be found',
  405: STATUS_CODES[405]!,
  500: STATUS_CODES[500]!,
}

export const errorStyles = createStyles({
  '@global': {
    body: {
      margin: 0,
      overflowY: 'hidden',
    },
  },
  error: {
    color: '#000',
    background: '#fff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    height: '100vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    display: 'inline-block',
    textAlign: 'left',
    lineHeight: '49px',
    height: 49,
    verticalAlign: 'middle',
  },
  code: {
    display: 'inline-block',
    borderRight: '1px solid rgba(0, 0, 0, 0.3)',
    margin: 0,
    marginRight: 20,
    padding: '10px 23px 10px 0',
    fontSize: 24,
    fontWeight: 500,
    verticalAlign: 'top',
  },
  message: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0,
  },
})

const useStyles = makeStyles(errorStyles, { classNamePrefix: 'errorPage' })

export const ErrorPage = ({ statusCode, title }: ErrorProps) => {
  title = useMemo(
    () =>
      title || statusCodes[statusCode] || 'An unexpected error has occurred',
    [statusCode, title]
  )

  const classes = useStyles()
  return (
    <div className={classes.error}>
      <Head async>
        <title>{`${statusCode} : ${title}`}</title>
      </Head>
      <div>
        <h1 className={classes.code}>{statusCode}</h1>
        <div className={classes.desc}>
          <h2 className={classes.message}>{title}.</h2>
        </div>
      </div>
    </div>
  )
}

export interface ErrorProps {
  statusCode: keyof typeof statusCodes
  title?: string
}
