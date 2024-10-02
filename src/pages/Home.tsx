import { useEffect } from 'react';
import yayawallet from '../assets/yayawallet-brand.svg';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const { user_role } = user || {};

  const navigate = useNavigate();

  useEffect(() => {
    if (!user_role || user_role === 'admin') {
      navigate('/no-role-assigned');
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-5 mt-20">
      <img src={yayawallet} alt="" className="w-1/4 lg:w-1/5" />
      <p className="text-gray-600  lg:text-[16px] text-center">Welcome to YaYa Dashboard</p>
    </div>
  );
};

export default Home;
