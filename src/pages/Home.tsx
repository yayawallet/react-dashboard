import yayawallet from '../assets/yayawallet-brand.svg';

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-5 mt-20">
      <img src={yayawallet} alt="" className="w-1/4 lg:w-1/5" />
      <p className="text-gray-600  lg:text-[16px] text-center">Welcome to YaYa Dashboard</p>
    </div>
  );
};

export default Home;
