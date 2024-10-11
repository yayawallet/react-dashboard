import { HiOutlineRefresh } from 'react-icons/hi';

const RefreshButton = () => {
  return (
    <button
      type="button"
      className="btn bg-yaya-600 text-white flex gap-x-1 items-center  px-2.5 py-1.5 rounded-md hover:bg-yaya-700 focus:ring-4 focus:ring-yaya-100"
    >
      <HiOutlineRefresh />
      <span>Refresh</span>
    </button>
  );
};

export default RefreshButton;
