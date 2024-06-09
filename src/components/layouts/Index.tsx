import { Outlet } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

const Index = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Outlet />
    </>
  );
};

export default Index;
