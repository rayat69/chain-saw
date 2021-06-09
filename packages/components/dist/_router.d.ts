import React from 'react';
import { BrowserRouterProps, SwitchProps, RedirectProps, RouteProps } from 'react-router-dom';
import { Requiryfy } from './types';
export declare const Switch: React.FC<SwitchProps>;
export declare const Router: React.FC<BrowserRouterProps>;
export declare const NestedRoute: React.FC<NestedRouteProps>;
export interface NestedRouteProps extends Requiryfy<RouteProps, 'path'> {
}
export declare const NestedRedirect: React.FC<RedirectProps>;
export type { BrowserRouterProps as RouterProps, SwitchProps, RouteProps, } from 'react-router-dom';
export { Redirect, Route } from 'react-router-dom';
