import {
  IoLogOutOutline,
  IoPersonCircleOutline,
  IoKeyOutline,
  IoLockOpenOutline,
} from 'react-icons/io5';

const UserSettings = () => {
  const user_role = localStorage.getItem('user_role') || 'user';
  const username = localStorage.getItem('username') || '-';
  const user_id = localStorage.getItem('user_id') || '-';

  return (
    <div className="absolute top-16 right-8 bg-white z-50">
      <ul className="pt-6 shadow rounded text-lg text-gray-600">
        <li className="flex items-center px-6 pr-24 py-1 cursor-pointer hover:text-blue-600 hover:bg-slate-50">
          <span className="text-xl px-3 py-2">
            <IoLockOpenOutline />
          </span>
          <span>{user_role}</span>
        </li>

        <li className="flex items-center px-6 pr-24 py-1 cursor-pointer hover:text-blue-600 hover:bg-slate-50">
          <span className="text-xl px-3 py-2">
            <IoKeyOutline />
          </span>
          <span>user id: {user_id}</span>
        </li>

        <li className="flex items-center px-6 pr-24 py-1 cursor-pointer hover:text-blue-600 hover:bg-slate-50">
          <span className="text-2xl px-3 py-2">
            <IoPersonCircleOutline />
          </span>
          <span>{username}</span>
        </li>

        <li className="flex items-center px-6 pr-16 py-1 border-t mt-4 cursor-pointer hover:text-blue-600 hover:bg-slate-50">
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
