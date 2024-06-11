import { createContext, useContext, useState } from 'react';
import { RenderRoutes } from '../components/layouts/RenderNavigation';

type User = {
  name: string;
  isAuthenticated: boolean;
};

const AuthContext = createContext<User | null>(null);
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
  const [user] = useState({ name: 'sura', isAuthenticated: true });

  return (
    <AuthContext.Provider value={user}>
      <RenderRoutes />
    </AuthContext.Provider>
  );
};
