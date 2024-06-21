import useSWRMutation from 'swr/mutation';
import { authAxios } from '../api/axios';

const useMutateData = async (path: string, body: object) => {
  const fetcher = () => authAxios.post(path, body).then((res) => res.data);

  const { trigger, data, error, isMutating } = useSWRMutation(path, fetcher);
  return { data, error, isMutating, fetcher: trigger };
};

export default useMutateData;
