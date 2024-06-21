import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = import.meta.env.VITE_BASE_URL;

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
    console.log('Axios request failed');
    console.log(error);

    if (error.response && error.response.status === 401) {
      console.log('Unauthorized request failed');
      localStorage.removeItem('user');
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
