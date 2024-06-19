import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../auth/AuthProvider';

const baseURL = import.meta.env.VITE_BASE_URL;

export default axios.create({
  baseURL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

const fetchAccessToken = async () => {
  const storedAccessToken = Cookies.get('access_token');
  if (!storedAccessToken) return null;

  return storedAccessToken;
};

export const authAxios = axios.create({
  baseURL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

authAxios.interceptors.request.use(
  async (config) => {
    const accessToken = await fetchAccessToken();
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
    console.log('Axios request failed');
    console.log('Axios request failed');

    // if (error.response && error.response.status === 401) {
    //   localStorage.clear();
    //   window.location.href = '/login';
    // }

    return Promise.reject(error);
  }
);
