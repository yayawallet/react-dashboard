import { createContext, useContext, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  user_role: string;
  username: string;
  login: (accessToken: string, refreshToken: string, user_id: string, username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!Cookies.get('accessToken'));
  const [user_role, setUserRole] = useState<string>(localStorage.getItem('userRole') || '');
  const [username, setUsername] = useState<string>(localStorage.getItem('username') || '');

  const login = (accessToken: string, refreshToken: string, user_id: string, username: string) => {
    type TokenType = {
      roles: string[];
    };

    const decodedToken: TokenType = jwtDecode(accessToken);
    const user_role = decodedToken.roles[0].toLocaleLowerCase() || '';

    Cookies.set('access_token', accessToken);
    Cookies.set('refresh_token', refreshToken);
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('username', username);
    localStorage.setItem('user_role', user_role);

    setIsAuthenticated(true);
    setUserRole(user_role);
    setUsername(localStorage.getItem('username') || '');
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.removeItem('user_Id');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');

    setIsAuthenticated(false);
    setUserRole('');
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user_role, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
