import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../CONSTANTS.ts';

export default axios.create({
  baseURL: BASE_URL,
});

export const authAxios = axios.create({
  baseURL: BASE_URL,
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
