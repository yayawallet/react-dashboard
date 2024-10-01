import yayaBrand from '../../assets/yayawallet-brand.svg';

const YaYaLogoComponent = () => {
  return (
    <div className="flex justify-self-center fixed bottom-2 left-0 right-0 md:ml-[300px]">
      <img src={yayaBrand} alt="YaYa Wallet" width={'120px'} />
    </div>
  );
};

export default YaYaLogoComponent;
