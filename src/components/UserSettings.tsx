import { useState } from 'react';
import { IoLogOutOutline, IoPersonCircleOutline } from 'react-icons/io5';

const UserSettings = () => {
  const [user_id, setUser_id] = useState(1);

  return (
    <div className="absolute top-16 right-8">
      <ul className="p-2 border">
        <li className="flex items-center">
          <span className="text-xl px-2 py-2">
            <IoPersonCircleOutline />
          </span>
          <span>user_id: {user_id}</span>
        </li>

        <li className="flex items-center">
          <span className="text-xl px-2 py-2">
            <IoPersonCircleOutline />
          </span>
          <span>username</span>
        </li>

        <li className="flex items-center">
          <span className="text-xl px-2 py-2">
            <IoLogOutOutline />
          </span>
          <span>Log Out</span>
        </li>
      </ul>
    </div>
  );
};

export default UserSettings;
