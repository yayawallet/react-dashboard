import { DotLoaderLarge } from './DotLoader';
import yayaBrand from '../../assets/yayawallet-brand.svg';

const PageLoading = () => {
  return (
    <div id="popup-modal" className="flex overflow-hidden justify-center items-center mt-40">
      <DotLoaderLarge />

      <div className="flex justify-self-center fixed bottom-2 left-0 right-0 md:ml-[300px]">
        <img src={yayaBrand} alt="YaYa Wallet" width={'120px'} />
      </div>
    </div>
  );
};

export default PageLoading;
