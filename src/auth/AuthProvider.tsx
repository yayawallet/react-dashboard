import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCookies } from '../hooks/useCookies';

type UserType = {
  roles: string[];
  username: string;
  user_id: string;
};

type FilteredUserType = {
  username: string;
  user_role: string;
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
  };

  const logout = () => {
    setAccessToken('');
    setRefreshToken('');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
