import { useState, useEffect, useRef } from 'react';
import { authAxios } from '../api/axios';
import avater from '../assets/avater.svg';
import { User } from '../models';
import { useGetData } from '../hooks/useSWR';
import { debounce } from 'lodash';

interface Props {
  query: string;
  includeSelf?: boolean;
  accountType?: string;
  onSelecteUser: (user: string) => void;
}

const SearchUserInline = ({ query, includeSelf, accountType, onSelecteUser }: Props) => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userNotFound, setUserNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: { account: ownAccount } = {} } = useGetData('/user/profile');

  const debouncedSearch = useRef(
    debounce((query) => {
      setUserNotFound(false);
      setSelectedUser('');
      setIsLoading(true);

      authAxios
        .post('/user/search', {
          query: query,
        })
        .then((res) => {
          let users = res.data;

          if (accountType?.toLocaleUpperCase() === 'BUSINESS') {
            users = users.filter((user: User) => user.type?.toUpperCase() === 'BUSINESS');
          }

          if (includeSelf) {
            setUsersList(users.slice(0, 5));
          } else {
            setUsersList(users.slice(0, 5).filter((user: User) => user.account !== ownAccount));
          }

          if (users?.length === 0) {
            setUserNotFound(true);
          }
        })
        .catch(() => {
          setUserNotFound(true);
        })
        .finally(() => setIsLoading(false));
    }, 500)
  ).current;

  useEffect(() => {
    setUserNotFound(false);

    if (query.length < 3) {
      setUsersList([]);

      return;
    }

    if (query === selectedUser) return;
    if (query.length > 12) return; // username is 12 characters long

    debouncedSearch(query);
    // Cleanup function to cancel debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [query]);

  return (
    <div
      className={`relative z-0 w-full ${usersList.length > 0 ? 'border' : ''} border-gray-200 rounded-lg`}
    >
      {usersList.length > 0 ? (
        <div className="bg-gray-0 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none">
          {usersList?.slice(0, 5).map((user) => (
            <div
              key={user.account}
              className={`flex gap-2 items-center px-2 py-1 border-b border-gray-100 hover:bg-gray-100 cursor-pointer wborder rounded ${selectedUser ? 'bg-violet-500 hover:bg-violet-500 rounded text-white' : ''}`}
              onClick={() => {
                onSelecteUser(user.account);
                setSelectedUser(user.account);
                setUsersList([user]);
              }}
            >
              <img
                src={user.photo_url || avater}
                alt=""
                className="h-8 w-8 rounded-full border-2 border-white"
              />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <span className="inline-block mt-1 pl-2 font-semibold text-sm text-gray-800">
          Searching{' '}
          <span
            className="inline-block border-gray-500 h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></span>
        </span>
      ) : userNotFound ? (
        <span className="block px-5 pt-0.5 pb-1 mt-1 font-semibold text-sm bg-gray-100 rounded">
          No users found
        </span>
      ) : (
        ''
      )}
    </div>
  );
};

export default SearchUserInline;
