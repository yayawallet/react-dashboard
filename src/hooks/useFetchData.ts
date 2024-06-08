import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useFetchData = (key: (string | number)[], path: string) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const url = baseUrl + path;

  const fetchData = () => {
    return axios.get(url).then((res) => res.data);
  };

  const options = {
    placeholderData: keepPreviousData,
  };

  return useQuery({ queryKey: key, queryFn: fetchData, ...options });
};

export default useFetchData;
