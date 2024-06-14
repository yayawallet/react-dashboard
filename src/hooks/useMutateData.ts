import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useMutateData = (key: (string | number)[], path: string, body: object) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const url = baseUrl + path;

  const fetchData = () => {
    return axios.post(url, body).then((res) => res.data);
  };

  return useQuery({ queryKey: key, queryFn: fetchData });
};

export default useMutateData;
