"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loading = void 0;
const react_1 = __importDefault(require("react"));
const Backdrop_1 = __importDefault(require("@material-ui/core/Backdrop"));
const CircularProgress_1 = __importDefault(require("@material-ui/core/CircularProgress"));
const Loading = () => {
    return (react_1.default.createElement(Backdrop_1.default, { open: true },
        react_1.default.createElement(CircularProgress_1.default, { color: "inherit" })));
};
exports.Loading = Loading;
//# sourceMappingURL=_loading.js.map