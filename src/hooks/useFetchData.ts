import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { authAxios } from '../api/axios';

const useFetchData = (key: (string | number)[], path: string) => {
  const fetchData = () => {
    return authAxios.get(path).then((res) => res.data);
  };

  const options = {
    placeholderData: keepPreviousData,
  };

  return useQuery({ queryKey: key, queryFn: fetchData, ...options });
};

export default useFetchData;
