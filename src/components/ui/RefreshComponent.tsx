import { DotLoaderMedium } from './DotLoader';

interface Props {
  isRefreshing: boolean;
}

const RefreshComponent = ({ isRefreshing }: Props) => {
  return (
    <div className={`${isRefreshing ? '' : 'hidden'}`}>
      <div
        className="absolute z-10"
        style={{
          top: '64px',
          left: '50%',
          transform: 'translate(-50%)',
        }}
      >
        <DotLoaderMedium />
        {/* <span
          className="inline-block border-gray-400 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></span> */}
      </div>
    </div>
  );
};

export default RefreshComponent;
