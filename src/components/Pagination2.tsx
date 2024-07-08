import { useState } from 'react';

interface Props {
  currentPage: number;
  pageCount: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

const Pagination2 = ({ currentPage, pageCount, isLoading, onPageChange }: Props) => {
  const [startAt, setStartAt] = useState(0);
  const [temp, setTemp] = useState(0);

  const handlePrevPage = () => {
    onPageChange(currentPage - 1);
    if (currentPage) {
      console.log('woow');
      setStartAt((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    onPageChange(currentPage + 1);
    if (currentPage === startAt + 3 && currentPage < pageCount - 10) setStartAt((prev) => prev + 1);
  };

  return (
    <div className="my-4 flxe text-center text-slate-600">
      <ul className="flex items-center">
        <li className={`pr-2 text-[15px]`} onClick={handlePrevPage}>
          <button disabled={currentPage === 1} className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M15 6l-6 6l6 6"></path>
            </svg>
            <span>prev</span>
          </button>
        </li>

        <button
          onClick={() => onPageChange(1)}
          className={`${pageCount > 1 ? '' : 'hidden'} ${currentPage === 1 ? 'bg-blue-600 text-white' : ''} flex justify-center items-center h-[28px] w-[28px] rounded cursor-pointer`}
        >
          {1}
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className={`${pageCount > 1 ? '' : 'hidden'} ${currentPage === startAt + 2 ? 'bg-blue-600 text-white' : ''} flex justify-center items-center h-[28px] w-[28px] rounded cursor-pointer`}
        >
          {currentPage < 3 ? 2 : temp > pageCount - 2 ? pageCount - 2 : 2}
        </button>
        <button
          onClick={() => onPageChange(currentPage)}
          className={`${pageCount > 2 ? '' : 'hidden'} ${currentPage === startAt + 3 ? 'bg-blue-600 text-white' : ''} flex justify-center items-center h-[28px] w-[28px] rounded cursor-pointer`}
        >
          {temp ? temp : 3}
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className={`${pageCount > 3 ? '' : 'hidden'} ${currentPage === startAt + 4 ? 'bg-blue-600 text-white' : ''} flex justify-center items-center h-[28px] w-[28px] rounded cursor-pointer`}
        >
          {temp ? temp + 1 : 4}
        </button>
        <button
          onClick={() => onPageChange(pageCount)}
          className={`${pageCount > 4 ? '' : 'hidden'} ${currentPage === pageCount ? 'bg-blue-600 text-white' : ''} flex justify-center items-center h-[28px] w-[28px] rounded cursor-pointer`}
        >
          {pageCount}
        </button>

        <li className="pl-2 text-[15px] cursor-pointer">
          <button
            disabled={currentPage >= pageCount}
            className="flex items-center"
            onClick={handleNextPage}
          >
            <span>next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 6l6 6l-6 6"></path>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination2;
