import React from 'react'
import {
  BrowserRouter,
  BrowserRouterProps,
  Switch as BrowserSwitch,
  SwitchProps,
  Redirect,
  RedirectProps,
  Route,
  RouteProps,
  useRouteMatch,
} from 'react-router-dom'
import { Requiryfy } from './types'
import { statusCodes, ErrorPage } from './_error'

export const Switch: React.FC<SwitchProps> = ({ children, ...rest }) => {
  return (
    <BrowserSwitch {...rest}>
      {children}
      <Redirect to="/404" />
    </BrowserSwitch>
  )
}

export const Router: React.FC<BrowserRouterProps> = ({ children, ...rest }) => {
  return (
    <BrowserRouter {...rest}>
      <Switch>
        {children}
        {Object.keys(statusCodes).map(key => (
          <Route key={`error:${key}`} path={`/${key}`}>
            <ErrorPage statusCode={parseInt(key) as keyof typeof statusCodes} />
          </Route>
        ))}
      </Switch>
    </BrowserRouter>
  )
}

export const NestedRoute: React.FC<NestedRouteProps> = ({
  path: inputPath,
  ...rest
}) => {
  const { path } = useRouteMatch()

  if (inputPath instanceof Array) {
    if (inputPath.length === 0 && inputPath[0] === '/') {
      inputPath = ['']
    }
    inputPath = [path].concat(inputPath)
  }
  if (typeof inputPath === 'string') {
    if (inputPath === '/') inputPath = ''
    inputPath = path + inputPath
  }
  return <Route path={inputPath} {...rest} />
}

export interface NestedRouteProps extends Requiryfy<RouteProps, 'path'> {}

export const NestedRedirect: React.FC<RedirectProps> = ({
  from,
  to,
  ...rest
}) => {
  const { path } = useRouteMatch()

  if (to === '/') to = ''
  if (from === '/') from = ''

  return (
    <Redirect
      from={from ? `${path}${from}` : undefined}
      to={`${path}${to}`}
      {...rest}
    />
  )
}

export type {
  BrowserRouterProps as RouterProps,
  SwitchProps,
  RouteProps,
} from 'react-router-dom'

export { Redirect, Route } from 'react-router-dom'
