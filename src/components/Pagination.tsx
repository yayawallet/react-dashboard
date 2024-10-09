import { useState } from 'react';

interface Props {
  currentPage: number;
  pageCount: number;
  total: number;
  perPage: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

const Pagination = ({ currentPage, pageCount, total, perPage, isLoading, onPageChange }: Props) => {
  const [left, setLeft] = useState(2);
  const [middle, setMiddle] = useState(3);
  const [right, setRight] = useState(4);

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber);

    if (pageCount < 5) {
      return;
    }

    if (pageNumber === 1 || pageNumber === 2) {
      setLeft(2);
      setMiddle(3);
      setRight(4);

      return;
    }

    if (pageNumber === pageCount || pageNumber === pageCount - 1) {
      setLeft(pageCount - 3);
      setMiddle(pageCount - 2);
      setRight(pageCount - 1);

      return;
    }

    if (pageNumber > 2) {
      setLeft(pageNumber - 1);
      setMiddle(pageNumber);
      setRight(pageNumber + 1);

      return;
    }

    if (pageNumber <= pageCount - 2) {
      setLeft(pageNumber - 1);
      setMiddle(pageNumber);
      setRight(pageNumber + 1);

      return;
    }
  };

  return (
    <div className="flex flex-wrap justify-center sm:justify-between items-center px-5 bg-gray-100 rounded-t rounded-xl">
      <p className="text-[15px] text-slate-700 py-4">
        {
          <span>
            Showing {isLoading ? '...' : (currentPage - 1) * perPage + 1} to{' '}
            {isLoading ? '...' : currentPage === pageCount ? total : currentPage * perPage} of{' '}
            {total} entries
          </span>
        }
      </p>

      <div className="my-4 flxe text-center text-slate-600">
        <ul className="flex items-center">
          <li className={`pr-2 text-[15px]`}>
            <button
              className="flex items-center disabled:cursor-auto"
              disabled={currentPage <= 1}
              onClick={() => handlePageClick(currentPage - 1)}
            >
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

          <li>
            <button
              className={`
            ${pageCount < 1 ? 'hidden' : ''}
            ${currentPage === 1 ? 'bg-yayaBrand-600 text-white' : ''}
            flex justify-center items-center h-[28px] min-w-[26px] px-1 rounded cursor-pointer
          `}
              onClick={() => handlePageClick(1)}
            >
              {1}
            </button>
          </li>

          <li>
            <button
              className={`
            ${pageCount < 2 ? 'hidden' : ''}
            ${currentPage === left ? 'bg-yayaBrand-600 text-white' : ''}
            flex justify-center items-center h-[28px] min-w-[26px] px-1 rounded cursor-pointer
          `}
              onClick={() => handlePageClick(left)}
            >
              {left}
            </button>
          </li>

          <li>
            <button
              className={`
            ${pageCount < 3 ? 'hidden' : ''}
            ${currentPage === middle ? 'bg-yayaBrand-600 text-white' : ''}
            flex justify-center items-center h-[28px] min-w-[26px] px-1 rounded cursor-pointer
          `}
              onClick={() => handlePageClick(middle)}
            >
              {middle}
            </button>
          </li>

          <li>
            <button
              className={`
            ${pageCount < 4 ? 'hidden' : ''}
            ${currentPage === right ? 'bg-yayaBrand-600 text-white' : ''}
            flex justify-center items-center h-[28px] min-w-[26px] px-1 rounded cursor-pointer
          `}
              onClick={() => handlePageClick(right)}
            >
              {right}
            </button>
          </li>

          <li>
            <button
              className={`
            ${pageCount < 5 ? 'hidden' : ''}
            ${currentPage === pageCount ? 'bg-yayaBrand-600 text-white' : ''}
            flex justify-center items-center h-[28px] min-w-[26px] px-1 rounded cursor-pointer
          `}
              onClick={() => handlePageClick(pageCount)}
            >
              {pageCount}
            </button>
          </li>

          <li className="pl-2 text-[15px] cursor-pointer">
            <button
              className="flex items-center disabled:cursor-default"
              disabled={currentPage >= pageCount}
              onClick={() => handlePageClick(currentPage + 1)}
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
    </div>
  );
};

export default Pagination;
