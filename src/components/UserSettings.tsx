import { useAuth } from '../auth/AuthProvider';
import { IoLogOutOutline, IoPersonCircleOutline, IoLockOpenOutline } from 'react-icons/io5';

const UserSettings = () => {
  const { user, logout } = useAuth();
  const { username, user_role } = user || {};

  return (
    <div className="absolute top-16 right-8 bg-white z-50">
      <ul className="pt-4 shadow rounded text-lg text-gray-600">
        <li className="flex items-center px-6 pr-24">
          <span className="px-3 py-2">
            <IoLockOpenOutline />
          </span>
          <span>{user_role && user_role}</span>
        </li>

        <li className="flex items-center px-6 pr-24">
          <span className="text-lg px-3 py-2">
            <IoPersonCircleOutline />
          </span>
          <span>{username && username}</span>
        </li>

        <li
          className="flex items-center px-6 pr-16 py-2 border-t mt-2 cursor-pointer hover:text-blue-600 hover:bg-slate-100"
          onClick={() => logout()}
        >
          <span className="text-2xl px-3 py-2">
            <IoLogOutOutline />
          </span>
          <span>Log Out</span>
        </li>
      </ul>
    </div>
  );
};

export default UserSettings;
