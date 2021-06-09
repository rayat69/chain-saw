import React from 'react';
declare const useLocalStorage: UseLocalStorage;
export { useLocalStorage };
export declare type UseLocalStorage = <V>(key: string, value: V | (() => V)) => [V, React.Dispatch<React.SetStateAction<V>>];
