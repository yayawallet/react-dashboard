import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/layouts/Index';
import { menus } from './navigation';
import { useAuth } from '../auth/AuthProvider';

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
        <Route path="/" element={<Layout />}>
          {[...menuRoutes, ...subMenuRoutes]}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RenderRoutes;
