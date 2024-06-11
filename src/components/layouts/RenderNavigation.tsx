import { Route, Routes } from 'react-router-dom';
import Layout from '../layouts/Index';
import { menus } from './navigation';

export const RenderRoutes = () => {
  const subMenuRoutes: JSX.Element[] = [];

  const menuRoutes = menus.map((menu) => {
    if (menu.submenuItems?.length)
      subMenuRoutes.push(
        ...menu.submenuItems.map((subMenu) => (
          <Route key={subMenu.path} path={subMenu.path} element={subMenu.element} />
        ))
      );

    return <Route key={menu.path} path={menu.path} element={menu.element} />;
  });

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {[...menuRoutes, ...subMenuRoutes]}
      </Route>
    </Routes>
  );
};
