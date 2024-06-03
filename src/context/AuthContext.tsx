import { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  name: string;
  age: number;
};

type AuthContextModel = {
  authUser: User | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextModel | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setAuthUser({ name: 'Surafel', age: 25 });
    setIsLoggedIn(true);
  };

  const logout = () => {
    setAuthUser(null);
    setIsLoggedIn(false);
  };

  const value = {
    authUser,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
