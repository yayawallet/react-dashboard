import { useState } from 'react';
import Cookies from 'js-cookie';

export const useCookies = (keyName: string) => {
  const [CookieValue, setCookieValue] = useState(() => {
    try {
      return Cookies.get(keyName);
    } catch (err) {}
  });

  const setValue = (newValue: any) => {
    try {
      Cookies.set(keyName, newValue);
    } catch (err) {}

    setCookieValue(newValue);
  };

  return [CookieValue, setValue];
};
