import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { UserProfile } from '../../models';
import yayawalletLogo from '../../assets/yayawallet-brand.svg';
import avater from '../../assets/avater.svg';
import { useGetData } from '../../hooks/useSWR';
import SidebarItem from './SidebarItem';
import { sidebarNavs } from '../../routing/navigation';
import { useAuth } from '../../auth/AuthProvider';
import { capitalize } from '../../utils/table_utils';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();
  const user_role = user?.user_role || '';

  const { data: profile } = useGetData('/user/profile');

  const openSidebarMenu = () => {
    setSidebarOpen(true);
  };

  const sidebarMenus = sidebarNavs
    .filter((menu) => (menu.accessRoles ? menu.accessRoles.includes(user_role) : true))
    .filter((menu) => {
      if (menu.children) {
        menu.children = menu.children.filter((submenu) =>
          submenu.accessRoles ? submenu.accessRoles.includes(user_role) : true
        );
        return menu.children.length > 0;
      }
      return true;
    });

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        onClick={openSidebarMenu}
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 15.25zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-[300px] h-screen transition-transform lg:translate-x-0 leading-6 ${isSidebarOpen ? '' : '-translate-x-full'}`}
        aria-label="Sidebar"
      >
        <div className="h-full relative bg-gray-50">
          <div className="flex justify-between items-center shadow-sm sticky top-0 z-10 bg-gray-50">
            <Link
              to="/"
              aria-label="home page"
              className="flex items-center h-header ps-2.5 pt-2 pb-1"
            >
              <img src={yayawalletLogo} className="h-full" alt="YaYaWallet Logo" />
            </Link>
            <button
              type="button"
              className="lg:hidden flex text-gray-400 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 mr-2 items-center justify-center"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>

          <div className="px-3 pt-5 pb-24 h-full relative overflow-y-scroll sidebar-scrollbar">
            <ul className="space-y-2 mb-20 font-medium">
              <li>
                <div className="flex justify-center p-2">
                  <Link to="/profile" aria-label="profile">
                    <img
                      src={profile?.photo_url || avater}
                      alt=""
                      className="w-24 h-24 rounded-full "
                    />
                  </Link>
                </div>

                <Link
                  to="/profile"
                  aria-label="profile"
                  className="flex items-center p-2 text-[17px] text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <span className="flex-1 ms-3">
                    {capitalize(profile?.name || '')
                      .split(' ')
                      .slice(0, 2)
                      .join(' ') || <span>&nbsp;</span>}
                  </span>
                  <span className="inline-flex items-center justify-center border px-2 leading-5 ms-3 text-[13px] font-medium text-gray-800 bg-gray-100 rounded">
                    {profile?.type.replace(/([a-zA-Z])(\d)/g, '$1 $2') || 'LEVEL -'}
                  </span>
                </Link>
              </li>

              {sidebarMenus.map((menu, index) => (
                <SidebarItem key={index} menu={menu} />
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
