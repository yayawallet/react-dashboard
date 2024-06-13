import { useQuery } from '@tanstack/react-query';
import { authAxios } from '../api/axios';

const useMutateData = (key: (string | number)[], path: string, body: object) => {
  const fetchData = () => {
    return authAxios.post(path, body).then((res) => res.data);
  };

  return useQuery({ queryKey: key, queryFn: fetchData });
};

export default useMutateData;
