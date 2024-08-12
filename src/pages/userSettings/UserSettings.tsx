import { useAuth } from '../../auth/AuthProvider';
import avater from '../../assets/avater.svg';
import { IoMdSettings } from 'react-icons/io';
import { MdContactSupport } from 'react-icons/md';
import { SlArrowRight } from 'react-icons/sl';
import { LuLogOut } from 'react-icons/lu';

const UserSettings = () => {
  const { user, logout } = useAuth();
  const { username } = user || {};

  return (
    <div className="absolute top-16 right-8 bg-white z-50">
      <ul className="flex flex-col gap-y-1 w-[360px] px-6 py-5 shadow rounded-xl text-[17px] text-gray-900">
        <div className="py-1 mb-2 text-lg shadow rounded-lg">
          <li className="flex-col items-center px-4">
            <span className="flex gap-x-2 items-center text-[19px] p-1 mr-2">
              <img src={avater} className="w-10 h-10 object-cover rounded" />
              <span>{username && username}</span>
            </span>
          </li>
        </div>

        <li className="flex items-center px-4 hover:bg-gray-100 py-2 rounded cursor-pointer">
          <span className="flex justify-center items-center text-xl p-1.5 mr-2 bg-gray-200 rounded-full">
            <IoMdSettings />
          </span>
          <span>Settings & privacy</span>

          <span className="text ml-auto pt-1 text-[16px] text-gray-600">
            <SlArrowRight />
          </span>
        </li>

        <li className="flex items-center px-4 hover:bg-gray-100 py-2 rounded cursor-pointer">
          <span className="flex justify-center items-center text-xl p-1.5 mr-2 bg-gray-200 rounded-full">
            <MdContactSupport />
          </span>
          <span>Help & support</span>
        </li>

        <li
          className="flex items-center px-4 hover:bg-gray-100 py-2 rounded cursor-pointer"
          onClick={() => logout()}
        >
          <span className="flex justify-center items-center text-xl p-1.5 mr-2 bg-gray-200 rounded-full">
            <LuLogOut />
          </span>
          <span>Log Out</span>
        </li>
      </ul>
    </div>
  );
};

export default UserSettings;
