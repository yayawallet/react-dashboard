import axios from 'axios';
import Cookies from 'js-cookie';

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
