import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from '../components/layouts/Index';
import { menus } from './navigation';
import { useAuth } from '../auth/AuthProvider';
import Login from '../pages/Authentication/Login';
import DefaultHeader from '../components/layouts/DefaultHeader';

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

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (
          <Route path="/" element={<Layout />}>
            {[...menuRoutes, ...subMenuRoutes]}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
        <Route path="/" element={<DefaultHeader />}>
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RenderRoutes;
