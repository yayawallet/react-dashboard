import { useState, useEffect } from 'react';
import axios from 'axios';
import avater from '../assets/avater.svg';
import { User } from '../models';
import useAccessToken from '../hooks/useAccessToken';

interface Props {
  query: string;
  onSelecteUser: (user: string) => void;
  onUserNotFound: (bol: boolean) => void;
}

const SearchUserInline = ({ query, onSelecteUser, onUserNotFound }: Props) => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userNotFound, setUserNotFound] = useState(false);

  const { accessToken } = useAccessToken();

  useEffect(() => {
    if (query === selectedUser) return;

    if (query.length < 3) {
      setUsersList([]);
      return;
    }
    setUserNotFound(false);
    setSelectedUser('');

    onUserNotFound(false);

    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/user/search`,
        {
          query: query,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => {
        setUsersList(res.data.slice(0, 5));

        if (res.data.length === 0) {
          setUserNotFound(true);
          onUserNotFound(true);
        }
      })
      .catch(() => {
        setUserNotFound(true);
        onUserNotFound(true);
      });
  }, [query]);

  return (
    <div className="relative z-0 w-full mb-10 group">
      <div className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 py-2 outline-none">
        {usersList?.slice(0, 5).map((user) => (
          <div
            key={user.account}
            className={`flex gap-2 items-center p-2 hover:bg-gray-100 cursor-pointer wborder rounded ${selectedUser ? 'bg-violet-500 hover:bg-violet-500 rounded text-white' : ''}`}
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

        {userNotFound && <span className="block text-sm pl-4">No users found.</span>}
      </div>
    </div>
  );
};

export default SearchUserInline;
