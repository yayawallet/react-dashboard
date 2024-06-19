import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCookies } from '../hooks/useCookies';

type UserType = {
  roles: string[];
  username: string;
  user_id: string;
};

type AuthContextType = {
  user: UserType | null;
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
  const [user, setUser] = useLocalStorage('userrr');
  const [accessToken, setAccessToken] = useCookies('access_token');
  const [refreshToken, setRefreshToken] = useCookies('refresh_token');

  console.log(user);

  const login = (accessToken: string, refreshToken: string, user: UserType) => {
    const properUser = { user_id: user.user_id, username: user.username, user_role: user.roles[0] };

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(properUser);
  };

  const logout = () => {
    setAccessToken('');
    setRefreshToken('');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
