import { useState } from 'react';

export const useLocalStorage = (keyName: string) => {
  const [storedValue, setStorageValue] = useState(() => {
    try {
      const value = localStorage.getItem(keyName) || '';
      return JSON.parse(value);
    } catch (err) {}
  });

  const setValue = (newValue: any) => {
    try {
      localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}

    setStorageValue(newValue);
  };

  return [storedValue, setValue];
};
