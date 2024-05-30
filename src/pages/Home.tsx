// import yayawallet from '../../assets/yayawallet-brand.svg';
import Authentication from './Authentication/Index';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const user = useAuth();
  console.log(user);
  return (
    // <div className="flex flex-col justify-center items-center gap-5 mt-20">
    // <img src={yayawallet} alt="" className="w-1/3" />
    // <p className="text-gray-600">Welcome to YaYa Wallet</p>
    <Authentication />
    // </div>
  );
};

export default Home;
