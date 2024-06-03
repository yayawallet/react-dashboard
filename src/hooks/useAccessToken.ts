import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useAccessToken = () => {
  const [accessToken, setAccessTokenState] = useState<string | null | undefined>(null);

  useEffect(() => {
    const token = getAccessToken();
    setAccessTokenState(token);
  }, []);

  const setAccessToken = (token: string) => {
    Cookies.set('access_token', token, { expires: 7 }); //expires in 7 days
    setAccessTokenState(token);
  };

  const getAccessToken = () => {
    return Cookies.get('access_token');
  };

  const removeAccessToken = () => {
    Cookies.remove('access_token');
    setAccessTokenState(null);
  };

  return { accessToken, setAccessToken, getAccessToken, removeAccessToken };
};

export default useAccessToken;
