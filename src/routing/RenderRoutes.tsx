import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { menus } from './navigation';
import { useAuth } from '../auth/AuthProvider';
import DefaultHeader from '../components/layouts/DefaultHeader';
import Layout from '../components/layouts/Index';
import Login from '../pages/Authentication/Login';
import Home from '../pages/Home';
import HelpCenter from '../pages/HelpCenter';
import AboutYaYa from '../pages/AboutYaYa';

const RenderRoutes = () => {
  const { isAuthenticated, user_role } = useAuth();

  const subMenuRoutes: JSX.Element[] = [];

  const menuRoutes = menus.map((menu) => {
    if (menu.isPrivate && !isAuthenticated) return;
    if (menu.accessRoles && !menu.accessRoles.includes(user_role)) return;

    if (menu.submenuItems?.length)
      subMenuRoutes.push(
        ...menu.submenuItems.map((subMenu) => {
          if (subMenu.accessRoles && !subMenu.accessRoles.includes(user_role)) return;
          return <Route key={subMenu.path} path={subMenu.path} element={subMenu.element} />;
        })
      );

    return <Route key={menu.path} path={menu.path} element={menu.element} />;
  });

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated === true && (
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
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        <Route path="/" element={<DefaultHeader />}>
          <Route path="login" element={<Login />} />
          <Route path="help-center" element={<HelpCenter />} />
          <Route path="about-yaya" element={<AboutYaYa />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RenderRoutes;
