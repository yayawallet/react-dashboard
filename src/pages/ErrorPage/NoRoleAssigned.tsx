import yayaBrand from '../../assets/yayawallet-brand.svg';
import { useAuth } from '../../auth/AuthProvider';
import { useGetData } from '../../hooks/useSWR';
import { LuLogOut } from 'react-icons/lu';

const NoRoleAssigned = () => {
  const { logout } = useAuth();

  const { data: userInfo } = useGetData('user/me/');

  return (
    <div className="page-container text-center">
      <h1 className="text-2xl lg:text-4xl pt-[10vh] pb-4">
        Sorry, you can't access this dashboard.
      </h1>
      <p className="text-lg pb-10">
        {`${userInfo?.user?.first_name} ${userInfo?.user?.last_name}`}
        <span className="text-gray-600 pl-0.5 pr-2 text-base">@{userInfo?.user?.username}</span>
        is <strong>not assigned</strong> a <strong>Role</strong>.
      </p>

      <button
        type="button"
        className="text-white bg-yayaBrand-600 hover:bg-yayaBrand-700 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg min-w-[120px] px-5 py-2.5 text-center"
        onClick={() => logout()}
      >
        <div
          className="flex items-center justify-center pr-2 gap-x-1 text-sm sm:text-base"
          style={{ letterSpacing: '0.3px' }}
        >
          <span className="pt-0.5 text-lg">
            <LuLogOut />
          </span>
          <span>Logout</span>
        </div>
      </button>

      <div className="flex justify-self-center fixed bottom-2 left-0 right-0 md:ml-[300px]">
        <img src={yayaBrand} alt="YaYa Wallet" width={'120px'} />
      </div>
    </div>
  );
};

export default NoRoleAssigned;
