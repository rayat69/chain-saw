"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = exports.Redirect = exports.NestedRedirect = exports.NestedRoute = exports.Router = exports.Switch = void 0;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const _error_1 = require("./_error");
const Switch = (_a) => {
    var { children } = _a, rest = __rest(_a, ["children"]);
    return (react_1.default.createElement(react_router_dom_1.Switch, Object.assign({}, rest),
        children,
        react_1.default.createElement(react_router_dom_1.Redirect, { to: "/404" })));
};
exports.Switch = Switch;
const Router = (_a) => {
    var { children } = _a, rest = __rest(_a, ["children"]);
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, Object.assign({}, rest),
        react_1.default.createElement(exports.Switch, null,
            children,
            Object.keys(_error_1.statusCodes).map(key => (react_1.default.createElement(react_router_dom_1.Route, { key: `error:${key}`, path: `/${key}` },
                react_1.default.createElement(_error_1.ErrorPage, { statusCode: parseInt(key) })))))));
};
exports.Router = Router;
const NestedRoute = (_a) => {
    var { path: inputPath } = _a, rest = __rest(_a, ["path"]);
    const { path } = react_router_dom_1.useRouteMatch();
    if (inputPath instanceof Array) {
        if (inputPath.length === 0 && inputPath[0] === '/') {
            inputPath = [''];
        }
        inputPath = [path].concat(inputPath);
    }
    if (typeof inputPath === 'string') {
        if (inputPath === '/')
            inputPath = '';
        inputPath = path + inputPath;
    }
    return react_1.default.createElement(react_router_dom_1.Route, Object.assign({ path: inputPath }, rest));
};
exports.NestedRoute = NestedRoute;
const NestedRedirect = (_a) => {
    var { from, to } = _a, rest = __rest(_a, ["from", "to"]);
    const { path } = react_router_dom_1.useRouteMatch();
    if (to === '/')
        to = '';
    if (from === '/')
        from = '';
    return (react_1.default.createElement(react_router_dom_1.Redirect, Object.assign({ from: from ? `${path}${from}` : undefined, to: `${path}${to}` }, rest)));
};
exports.NestedRedirect = NestedRedirect;
var react_router_dom_2 = require("react-router-dom");
Object.defineProperty(exports, "Redirect", { enumerable: true, get: function () { return react_router_dom_2.Redirect; } });
Object.defineProperty(exports, "Route", { enumerable: true, get: function () { return react_router_dom_2.Route; } });
//# sourceMappingURL=_router.js.map