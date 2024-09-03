import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCookies } from '../hooks/useCookies';
import Cookies from 'js-cookie';
import { updateTokenExpiredTime } from '../api/axios';

type UserType = {
  roles: string[];
  username: string;
  user_id: string;
};

type FilteredUserType = {
  username: string;
  user_role: string;
  user_id: number;
};

type AuthContextType = {
  user: FilteredUserType | null;
  login: (accessToken: string, refreshToken: string, user: UserType) => void;
  logout: () => void;
};

const defaultAuthContext: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage('user');
  const [, setAccessToken] = useCookies('access_token');
  const [, setRefreshToken] = useCookies('refresh_token');

  const login = (accessToken: string, refreshToken: string, user: UserType) => {
    const { user_id, username, roles } = user;
    const user_role = roles?.length ? roles[0].toLowerCase() : '';

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser({ user_id, username, user_role });

    updateTokenExpiredTime(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('user');
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');

    window.location.href = '/login';
  };

  // logout a user if user close browser tap or window, and then set a new session
  if (!sessionStorage.getItem('session_alive')) {
    logout();
    sessionStorage.setItem('session_alive', 'true');
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
