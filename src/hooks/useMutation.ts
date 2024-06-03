import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useAccessToken from './useAccessToken';

const useMutation = (key: (string | number)[], path: string, body: object) => {
  const { accessToken } = useAccessToken();

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const url = baseUrl + path;

  const fetchData = () => {
    return axios
      .post(url, body, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => res.data);
  };

  return useQuery({ queryKey: key, queryFn: fetchData });
};

export default useMutation;
