function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var hooks = require('@utils/hooks');

var DarkModeContext = React.createContext({
  isDark: false,
  toggle: function toggle() {}
});
var useDark = function useDark() {
  return React.useContext(DarkModeContext);
};
var DarkModeProvider = function DarkModeProvider(_ref) {
  var children = _ref.children;

  var _useDarkmode = hooks.useDarkmode('innovation-docs:dark'),
      isDark = _useDarkmode.isDark,
      toggle = _useDarkmode.toggle;

  return React__default.createElement(DarkModeContext.Provider, {
    value: {
      isDark: isDark,
      toggle: toggle
    }
  }, children);
};

exports.DarkModeProvider = DarkModeProvider;
exports.useDark = useDark;
//# sourceMappingURL=index.js.map
