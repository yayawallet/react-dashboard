import { Outlet } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <>
      <Header />
      <Sidebar />

      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
