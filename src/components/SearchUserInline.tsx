import { useState, useEffect } from 'react';
import { authAxios } from '../api/axios';
import avater from '../assets/avater.svg';
import { User } from '../models';

interface Props {
  query: string;
  onSelecteUser: (user: string) => void;
}

const SearchUserInline = ({ query, onSelecteUser }: Props) => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setUsersList([]);
      return;
    }

    setUserNotFound(false);
    setSelectedUser('');

    authAxios
      .post('/user/search', {
        query: query,
      })
      .then((res) => {
        setUsersList(res.data.slice(0, 5));

        if (res.data.length === 0) {
          setUserNotFound(true);
        }
      })
      .catch(() => {
        setUserNotFound(true);
      });
  }, [query]);

  return (
    <div
      className={`relative z-0 w-full mb-6 ${usersList.length > 0 ? 'border' : ''} border-gray-200 rounded-lg`}
    >
      <div className="bg-gray-0 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none">
        {usersList?.slice(0, 5).map((user) => (
          <div
            key={user.account}
            className={`flex gap-2 items-center p-2 border-b border-gray-100 hover:bg-gray-100 cursor-pointer wborder rounded ${selectedUser ? 'bg-violet-500 hover:bg-violet-500 rounded text-white' : ''}`}
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

        {userNotFound && <span className="block text-red-600 pt-0.5 pl-3">No users found</span>}
      </div>
    </div>
  );
};

export default SearchUserInline;
