import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from '../components/layouts/Index';
import { menus } from './navigation';
import { useAuth } from '../auth/AuthProvider';
import Login from '../pages/Authentication/Login';
import DefaultHeader from '../components/layouts/DefaultHeader';
import Home from '../pages/Home';
import Profile from '../pages/Profile';

const RenderRoutes = () => {
  const { isAuthenticated } = useAuth();

  const subMenuRoutes: JSX.Element[] = [];

  const menuRoutes = menus.map((menu) => {
    if (menu.isPrivate && !isAuthenticated) return;

    if (menu.submenuItems?.length)
      subMenuRoutes.push(
        ...menu.submenuItems.map((subMenu) => (
          <Route key={subMenu.path} path={subMenu.path} element={subMenu.element} />
        ))
      );

    return <Route key={menu.path} path={menu.path} element={menu.element} />;
  });

  console.log({ isAuthenticated });

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated && (
          <>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              {menuRoutes}
              {subMenuRoutes}
            </Route>
          </>
        )}

        {isAuthenticated === false && (
          <>
            <Route path="/" element={<DefaultHeader />}>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace={true} />} />
            </Route>
          </>
        )}

        {/* <Route index element={<Navigate to="/login" replace={true} />} /> */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RenderRoutes;
