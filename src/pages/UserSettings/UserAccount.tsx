import { useNavigate } from 'react-router-dom';
import { IoChevronForward } from 'react-icons/io5';
import { useGetData } from '../../hooks/useSWR';
import { capitalize } from '../../utils/table_utils';

const UserAccount = () => {
  const navigate = useNavigate();

  const { data: userInfo } = useGetData('/user/me');

  return (
    <div className="page-container">
      <h3 className="text-2xl font-semibold p-2 mb-10">User Account</h3>

      <div className="flex flex-wrap gap-5 items-center">
        <div className="flex flex-col justify-center items-center">
          <img
            src={`${import.meta.env.VITE_BASE_URL}${userInfo?.profile_image}`}
            alt=""
            className="border h-28 rounded-full"
          />
        </div>

        <ul className="max-w-[300px] text-gray-900" onClick={() => navigate('change-password')}>
          <li className="p-2">
            <span className="font-semibold">
              {capitalize(userInfo?.user?.first_name + ' ' + userInfo?.user?.last_name)}
            </span>
          </li>
          <li className="p-2">
            <span className="font-semibold">user id:</span> {userInfo?.user_id}
          </li>
          <li className="p-2">
            <span className="font-semibold">Phone:</span> {userInfo?.phone}
          </li>
        </ul>
      </div>

      <ul className="max-w-[300px] text-gray-900 mt-6" onClick={() => navigate('change-password')}>
        <li className="flex items-center justify-between p-2 bg-gray-100 rounded cursor-pointer hover:font-semibold hover:bg-gray-200">
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
