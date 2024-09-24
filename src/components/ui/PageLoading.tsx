import { DotLoaderLarge } from './DotLoader';

const PageLoading = () => {
  return (
    <div id="popup-modal" className="flex overflow-hidden justify-center items-center mt-40">
      <div aria-label="Loading..." role="status" className="flex items-center space-x-2">
        <DotLoaderLarge />
        {/* <span className="text-3xl font-medium text-yayaBrand-800 mb-2">Loading...</span> */}
      </div>
    </div>
  );
};

export default PageLoading;
