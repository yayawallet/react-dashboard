import { useEffect } from 'react';
import { Navigate, Routes } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    document.location.reload();
  }, [logout]);

  return (
    <Routes>
      <Navigate to="/login" />
    </Routes>
  );
};

export default Logout;
