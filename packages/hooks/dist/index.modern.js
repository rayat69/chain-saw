import { useState, useEffect, useMemo, useCallback } from 'react';

function parseLocalData(value) {
  if (value instanceof Function) {
    return JSON.stringify(value());
  }

  if (typeof value !== 'string') {
    return JSON.stringify(value);
  }

  return value;
}

var useLocalStorage = function useLocalStorage(key, value) {
  var _useState = useState(function () {
    if (value instanceof Function) {
      return value();
    }

    return value;
  }),
      task = _useState[0],
      setTask = _useState[1];

  useEffect(function () {
    var data = window.localStorage.getItem(key);
    if (!data) return;
    setTask(JSON.parse(data));
  }, [key]);
  useEffect(function () {
    window.localStorage.setItem(key, parseLocalData(task));
  }, [task, key]);
  return [task, setTask];
};

var useDarkmode = function useDarkmode(key) {
  if (key === void 0) {
    key = 'rayat-portfolio-projects:dark';
  }

  var localStorageKey = useMemo(function () {
    return key;
  }, [key]);

  var _useLocalStorage = useLocalStorage(localStorageKey, function () {
    if (!window.localStorage.getItem(localStorageKey)) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return false;
  }),
      isDark = _useLocalStorage[0],
      setIsDark = _useLocalStorage[1];

  var toggle = useCallback(function () {
    setIsDark(function (prevMode) {
      return !prevMode;
    });
  }, [setIsDark]);
  return {
    isDark: isDark,
    toggle: toggle
  };
};

var useSocket = function useSocket(socket) {
  useEffect(function () {
    socket.connect();
    return function () {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [socket]);
};

export { useDarkmode, useLocalStorage, useSocket };
//# sourceMappingURL=index.modern.js.map
