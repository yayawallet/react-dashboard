import { useAuth } from '../../auth/AuthProvider';
import avater from '../../assets/avater.svg';
import { IoMdSettings } from 'react-icons/io';
import { MdContactSupport } from 'react-icons/md';
import { LuLogOut } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { capitalize } from '../../utils/table_utils';
import { useGetData } from '../../hooks/useSWR';

interface Props {
  onCloseUserSettings: () => void;
}

const UserSettings = ({ onCloseUserSettings }: Props) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { data: userInfo } = useGetData('/user/me/');

  return (
    <div className="absolute top-16 right-4 bg-white z-50">
      <ul className="flex flex-col gap-y-1 w-full md:w-[360px] px-4 py-5 shadow rounded-xl font-semibold text-[16px] text-gray-900 cursor-auto">
        <div className="py-1 mb-2 text-lg shadow rounded-lg">
          <li className="flex-col items-center px-3">
            <span className="flex gap-x-2 items-center p-1 mr-2">
              <img
                src={
                  userInfo?.profile_image
                    ? import.meta.env.VITE_BASE_URL + userInfo?.profile_image
                    : avater
                }
                className="w-8 h-8 object-cover rounded-full"
              />
              <span>
                {capitalize(userInfo?.user?.first_name + ' ' + userInfo?.user?.last_name)}
              </span>
            </span>
          </li>
        </div>

        <li
          className="flex items-center px-4 hover:bg-gray-100 py-2 rounded cursor-pointer"
          onClick={() => {
            onCloseUserSettings();
            navigate('/account');
          }}
        >
          <span className="flex justify-center items-center text-xl p-1.5 mr-2 bg-gray-200 rounded-full">
            <IoMdSettings />
          </span>
          <span>Settings & privacy</span>
        </li>

        <li
          className="flex items-center px-4 hover:bg-gray-100 py-2 rounded cursor-pointer"
          onClick={() => {
            onCloseUserSettings();
            navigate('/support');
          }}
        >
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
