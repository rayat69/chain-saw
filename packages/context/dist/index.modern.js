import React, { createContext, useContext } from 'react';
import { useDarkmode } from '@utils/hooks';

var DarkModeContext = createContext({
  isDark: false,
  toggle: function toggle() {}
});
var useDark = function useDark() {
  return useContext(DarkModeContext);
};
var DarkModeProvider = function DarkModeProvider(_ref) {
  var children = _ref.children;

  var _useDarkmode = useDarkmode('innovation-docs:dark'),
      isDark = _useDarkmode.isDark,
      toggle = _useDarkmode.toggle;

  return React.createElement(DarkModeContext.Provider, {
    value: {
      isDark: isDark,
      toggle: toggle
    }
  }, children);
};

export { DarkModeProvider, useDark };
//# sourceMappingURL=index.modern.js.map
