import { Outlet } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

const Index = () => {
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

export default Index;
