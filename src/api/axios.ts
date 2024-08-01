import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = import.meta.env.VITE_BASE_URL;
let NUMBER_OF_TRIES = 0;

export default axios.create({
  baseURL,
});

export const authAxios = axios.create({
  baseURL,
});

authAxios.interceptors.request.use(
  (config) => {
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
      if (NUMBER_OF_TRIES <= 2) {
        axios
          .post('/refresh', { refresh: Cookies.get('refresh_token') })
          .then((res) => {
            NUMBER_OF_TRIES = 0;

            Cookies.set('access_token', res.data.access, {
              secure: true,
              sameSite: 'strict',
            });
          })
          .catch(() => NUMBER_OF_TRIES++);

        return;
      }

      localStorage.removeItem('user');
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
