import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useAccessToken from './useAccessToken';

const useFetchData = (key: (string | number)[], path: string) => {
  const { accessToken } = useAccessToken();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const url = baseUrl + path;

  const fetchData = () => {
    return axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => res.data);
  };

  const options = {
    placeholderData: keepPreviousData,
  };

  return useQuery({ queryKey: key, queryFn: fetchData, ...options });
};

export default useFetchData;
