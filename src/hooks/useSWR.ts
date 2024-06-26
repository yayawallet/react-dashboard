import useSWR from 'swr';
import { authAxios } from '../api/axios';

export const useGetData = (path: string) => {
  const fetcher = () => authAxios.get(path).then((res) => res.data);

  return useSWR(path, fetcher);
};

export const usePostData = (key: string | any[], body: object) => {
  const path = Array.isArray(key) ? key[0] : key;

  const fetcher = () => authAxios.post(path, body).then((res) => res.data);

  return useSWR(key, fetcher);
};
