"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavLink = exports.Link = void 0;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Link_1 = __importDefault(require("@material-ui/core/Link"));
const styles_1 = require("@material-ui/core/styles");
const useLinkStyles = styles_1.makeStyles(theme => ({
    link: {
        textTransform: (props) => !!props.uppercase ? 'uppercase' : 'none',
        '&:hover': {
            color: (props) => theme.palette[props.hoverColor || 'secondary'].main,
        },
    },
}), { classNamePrefix: 'customLink' });
const useNavLinkStyles = styles_1.makeStyles(theme => ({
    navLink: {
        textTransform: (props) => !!props.uppercase ? 'uppercase' : 'none',
        '&:hover': {
            color: (props) => theme.palette[props.hoverColor || 'secondary'].main,
        },
        '&.active': {
            color: (props) => theme.palette[props.activeColor || 'primary'].main,
        },
    },
}), { classNamePrefix: 'customNavLink' });
exports.Link = react_1.default.forwardRef((props, ref) => {
    const { link } = useLinkStyles({
        uppercase: props.uppercase,
        hoverColor: props.hoverColor,
    });
    return (react_1.default.createElement(Link_1.default, Object.assign({ ref: ref, className: link, color: "textPrimary", underline: "none", component: react_router_dom_1.Link }, props)));
});
exports.NavLink = react_1.default.forwardRef((props, ref) => {
    const { navLink } = useNavLinkStyles({
        uppercase: props.uppercase,
        activeColor: props.activeColor,
        hoverColor: props.hoverColor,
    });
    return (react_1.default.createElement(Link_1.default, Object.assign({ ref: ref, className: navLink, color: "textPrimary", underline: "none", component: react_router_dom_1.NavLink }, props)));
});
//# sourceMappingURL=_link.js.map