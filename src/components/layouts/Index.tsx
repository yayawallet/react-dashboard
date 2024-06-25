import { Outlet } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

const Index = () => {
  return (
    <>
      <div className="lg:ml-[300px] sticky top-0 left-0 right-0 z-10 bg-white">
        <Header />
      </div>

      <Sidebar />

      <div className="lg:ml-[300px] p-4">{<Outlet />}</div>
    </>
  );
};

export default Index;
