import { useRoutes } from 'react-router-dom';
import { publicNavs, privateNavs } from './navigation';
import { useAuth } from '../auth/AuthProvider';

type NavType = {
  title?: string;
  path: string;
  icon?: JSX.Element;
  element?: JSX.Element;
  accessRoles?: string[];
  children?: NavType[];
};

const AppRoutes = () => {
  const { isAuthenticated, user_role } = useAuth();

  const publicRoutes = publicNavs;
  const privateRoutes = privateNavs
    .filter((nav: NavType) => (nav.accessRoles ? nav.accessRoles.includes(user_role) : true))
    .filter((nav: NavType) => {
      if (!nav.children) return true;

      nav.children = nav.children.filter((subNav: NavType) =>
        subNav.accessRoles ? subNav.accessRoles.includes(user_role) : true
      );

      return nav.children.length > 0;
    });

  return useRoutes(isAuthenticated ? privateRoutes : publicRoutes);
};

export default AppRoutes;