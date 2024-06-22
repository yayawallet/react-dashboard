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
  const { user } = useAuth();
  const user_role = user?.user_role || '';

  const publicRoutes = publicNavs;
  const privateRoutes = privateNavs
    .filter((nav: NavType) => (nav.accessRoles ? nav.accessRoles.includes(user_role) : true))
    .filter((nav: NavType) => {
      if (!nav.children) return true;

      nav.children = nav.children
        .filter((subNav: NavType) =>
          subNav.accessRoles ? subNav.accessRoles.includes(user_role) : true
        )
        .filter((subNav: NavType) => {
          if (!subNav.children) return true;

          subNav.children = subNav.children.filter((subNav2: NavType) =>
            subNav2.accessRoles ? subNav2.accessRoles.includes(user_role) : true
          );

          return subNav.children.length > 0;
        });

      return nav.children.length > 0;
    });

  return useRoutes(user ? privateRoutes : publicRoutes);
};

export default AppRoutes;
