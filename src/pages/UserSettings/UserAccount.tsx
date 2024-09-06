import { useNavigate } from 'react-router-dom';
import { IoChevronForward } from 'react-icons/io5';
import { useGetData } from '../../hooks/useSWR';
import { capitalize } from '../../utils/table_utils';
import { useAuth } from '../../auth/AuthProvider';

const UserAccount = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { user_role } = user || {};

  const { data: userInfo } = useGetData('/user/me/');

  return (
    <div className="page-container">
      <h3 className="text-2xl font-semibold p-2 mb-10">User Account</h3>

      <div className="flex flex-wrap gap-5 items-center">
        <div className="flex flex-col justify-center items-center">
          <img
            src={import.meta.env.VITE_BASE_URL + userInfo?.profile_image}
            alt=""
            className="border h-28 rounded-full"
          />
        </div>

        <ul className="max-w-[300px] flex flex-col gap-1 text-gray-900">
          <li className="mb-2">
            <span className="font-semibold text-xl inline-block -mb-2">
              {capitalize(userInfo?.user?.first_name + ' ' + userInfo?.user?.last_name)}
            </span>
            <br />
            <span className="text-gray-600 font-normal">{user_role}</span>
          </li>
          <li className="">
            <span className="font-semibold">user id:</span> {userInfo?.user?.id}
          </li>
          <li className="">
            <span className="font-semibold">Phone:</span> {userInfo?.phone}
          </li>
        </ul>
      </div>

      <ul className="max-w-[300px] text-gray-900 mt-6">
        <li
          className="flex items-center justify-between p-2 bg-gray-100 rounded cursor-pointer hover:font-semibold hover:bg-gray-200"
          onClick={() => navigate('change-password')}
        >
          <span>Change Password</span>
          <span className="text-lg">
            <IoChevronForward />
          </span>
        </li>
      </ul>
    </div>
  );
};

export default UserAccount;
