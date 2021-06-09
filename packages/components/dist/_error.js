"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorPage = exports.errorStyles = exports.statusCodes = void 0;
const react_1 = __importStar(require("react"));
const http_1 = require("http");
const styles_1 = require("@material-ui/core/styles");
const _head_1 = require("./_head");
exports.statusCodes = {
    400: http_1.STATUS_CODES[400],
    401: http_1.STATUS_CODES[401],
    403: http_1.STATUS_CODES[403],
    404: 'This page could not be found',
    405: http_1.STATUS_CODES[405],
    500: http_1.STATUS_CODES[500],
};
exports.errorStyles = styles_1.createStyles({
    '@global': {
        body: {
            margin: 0,
            overflowY: 'hidden',
        },
    },
    error: {
        color: '#000',
        background: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
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
});
const useStyles = styles_1.makeStyles(exports.errorStyles, { classNamePrefix: 'errorPage' });
const ErrorPage = ({ statusCode, title }) => {
    title = react_1.useMemo(() => title || exports.statusCodes[statusCode] || 'An unexpected error has occurred', [statusCode, title]);
    const classes = useStyles();
    return (react_1.default.createElement("div", { className: classes.error },
        react_1.default.createElement(_head_1.Head, { async: true },
            react_1.default.createElement("title", null, `${statusCode} : ${title}`)),
        react_1.default.createElement("div", null,
            react_1.default.createElement("h1", { className: classes.code }, statusCode),
            react_1.default.createElement("div", { className: classes.desc },
                react_1.default.createElement("h2", { className: classes.message },
                    title,
                    ".")))));
};
exports.ErrorPage = ErrorPage;
//# sourceMappingURL=_error.js.map