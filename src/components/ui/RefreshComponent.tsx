interface Props {
  isRefreshing: boolean;
}

const RefreshComponent = ({ isRefreshing }: Props) => {
  return (
    <div className={`${isRefreshing ? '' : 'hidden'}`}>
      <div
        className="absolute z-10 bg-white rounded-full p-1.5"
        style={{
          top: '30vh',
          left: '50%',
          transform: 'translate(-50%)',
          boxShadow: '0 0 5px #888',
        }}
      >
        <span
          className="inline-block border-gray-400 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></span>
      </div>
    </div>
  );
};

export default RefreshComponent;
