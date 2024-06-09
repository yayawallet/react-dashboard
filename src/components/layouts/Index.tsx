import { Outlet } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

const Index = () => {
  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-10 bg-white">
        <Header />
      </div>
      <Sidebar />
      <Outlet />
    </>
  );
};

export default Index;
