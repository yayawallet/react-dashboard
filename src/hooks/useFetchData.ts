import useSWR from 'swr';
import { authAxios } from '../api/axios';

const useFetchData = (path: string) => {
  const fetcher = () => authAxios.get(path).then((res) => res.data);

  return useSWR(path, fetcher);
};

export default useFetchData;
