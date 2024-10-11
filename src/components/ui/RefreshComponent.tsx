import { DotLoaderMedium } from './DotLoader';

interface Props {
  isRefreshing: boolean;
}

const RefreshComponent = ({ isRefreshing }: Props) => {
  return (
    <div className={`${isRefreshing ? '' : 'hidden'}`}>
      <div className="fixed z-10 top-[36%] left-[50%] lg:left-[55%]">
        <div className="bg-white shadow shadow-yaya-100 rounded-full p-1">
          <div className="translate-y-0.5">
            <DotLoaderMedium />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefreshComponent;
