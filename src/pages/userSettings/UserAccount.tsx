import { useNavigate } from 'react-router-dom';
import { IoChevronForward } from 'react-icons/io5';

const UserAccount = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h3 className="text-2xl font-semibold p-2 mb-10">User Account</h3>

      <ul className="max-w-[300px] text-gray-900" onClick={() => navigate('change-password')}>
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
