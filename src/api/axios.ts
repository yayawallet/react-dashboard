import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const baseURL = import.meta.env.VITE_BASE_URL;
let tokenExpiresIn = new Date().getTime();

export default axios.create({
  baseURL,
});

export const authAxios = axios.create({
  baseURL,
});

const logout = () => {
  localStorage.removeItem('user');
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');

  window.location.href = '/login';
};

export const updateTokenExpiredTime = (token?: string) => {
  token = Cookies.get('access_token');

  const decoded = token ? jwtDecode(token) : undefined;

  tokenExpiresIn = decoded?.exp
    ? new Date(Number(decoded?.exp) * 1000).getTime()
    : new Date(0).getTime();
};

authAxios.interceptors.request.use(
  async (config) => {
    if (tokenExpiresIn <= new Date().getTime() + 1000) {
      try {
        const res = await axios.post(`${baseURL}/refresh`, {
          refresh: Cookies.get('refresh_token'),
        });

        Cookies.set('access_token', res.data.access);
        updateTokenExpiredTime(res.data.access);
      } catch (err) {
        try {
          const res = await axios.post(`${baseURL}/refresh`, {
            refresh: Cookies.get('refresh_token'),
          });

          Cookies.set('access_token', res.data.access);
          updateTokenExpiredTime(res.data.access);
        } catch (err) {
          Cookies.set('log', JSON.stringify(err));
          Cookies.set('log-0', 'Refresh Error');

          logout();
        }
      }
    }

    const accessToken = Cookies.get('access_token');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.set('log', JSON.stringify(error));
      Cookies.set('log-1', '401 Error');
      logout();
    }

    return Promise.reject(error);
  }
);
