import { createContext, useContext, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user_id: string, username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!Cookies.get('accessToken'));

  const login = (accessToken: string, refreshToken: string, user_id: string, username: string) => {
    Cookies.set('access_token', accessToken);
    Cookies.set('refresh_token', refreshToken);
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('username', username);

    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.removeItem('user_Id');
    localStorage.removeItem('username');

    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
