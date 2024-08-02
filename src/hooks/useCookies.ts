import { useState } from 'react';
import Cookies from 'js-cookie';

type SetCookieFunction = (newValue: string) => void;

export const useCookies = (keyName: string): [string | undefined, SetCookieFunction] => {
  const [storedValue, setStoredValue] = useState<string | undefined>(() => {
    try {
      const value = Cookies.get(keyName);
      return value;
    } catch (err) {
      return undefined;
    }
  });

  const setValue: SetCookieFunction = (newValue: string) => {
    try {
      Cookies.set(keyName, newValue, {
        secure: true,
        sameSite: 'strict',
      });
      setStoredValue(newValue);
    } catch (err) {}
  };

  return [storedValue, setValue];
};
