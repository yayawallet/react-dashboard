import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = window.env.BASE_URL;

export default axios.create({
  baseURL,
});

export const authAxios = axios.create({
  baseURL,
});

authAxios.interceptors.request.use(
  async (config) => {
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
      // logout();
    }

    return Promise.reject(error);
  }
);
