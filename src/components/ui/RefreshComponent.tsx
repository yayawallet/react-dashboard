import { DotLoaderMedium } from './DotLoader';

interface Props {
  isRefreshing: boolean;
}

const RefreshComponent = ({ isRefreshing }: Props) => {
  return (
    <div className={`${isRefreshing ? '' : 'hidden'}`}>
      <div
        className="fixed z-10 top-[50%] left-[50%] lg:left-[55%]"
        style={{
          transform: 'translate(-50%)',
        }}
      >
        <div className="bg-white shadow shadow-yayaBrand-400 rounded-full p-1">
          <div className="translate-y-0.5">
            <DotLoaderMedium />
          </div>
        </div>
        {/* <span
          className="inline-block border-gray-400 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></span> */}
      </div>
    </div>
  );
};

export default RefreshComponent;
