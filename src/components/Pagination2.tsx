import { useState } from 'react';

interface Props {
  currentPage: number;
  pageCount: number;
  onPageChange: (newPage: number) => void;
}

const Pagination2 = ({ currentPage, pageCount, onPageChange }: Props) => {
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

        <button
          className={`
            ${pageCount < 1 ? 'hidden' : ''}
            ${currentPage === 1 ? 'bg-blue-600 text-white' : ''}
            flex justify-center items-center h-[28px] w-[28px] rounded cursor-pointer
          `}
          onClick={() => handlePageClick(1)}
        >
          {1}
        </button>

        <button
          className={`
            ${pageCount < 2 ? 'hidden' : ''}
            ${currentPage === left ? 'bg-blue-600 text-white' : ''}
            flex justify-center items-center h-[28px] w-[28px] rounded cursor-pointer
          `}
          onClick={() => handlePageClick(left)}
        >
          {left}
        </button>

        <button
          className={`
            ${pageCount < 3 ? 'hidden' : ''}
            ${currentPage === middle ? 'bg-blue-600 text-white' : ''}
            flex justify-center items-center h-[28px] w-[28px] rounded cursor-pointer
          `}
          onClick={() => handlePageClick(middle)}
        >
          {middle}
        </button>

        <button
          className={`
            ${pageCount < 4 ? 'hidden' : ''}
            ${currentPage === right ? 'bg-blue-600 text-white' : ''}
            flex justify-center items-center h-[28px] w-[28px] rounded cursor-pointer
          `}
          onClick={() => handlePageClick(right)}
        >
          {right}
        </button>

        <button
          className={`
            ${pageCount < 5 ? 'hidden' : ''}
            ${currentPage === pageCount ? 'bg-blue-600 text-white' : ''}
            flex justify-center items-center h-[28px] w-[28px] rounded cursor-pointer
          `}
          onClick={() => handlePageClick(pageCount)}
        >
          {pageCount}
        </button>

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
  );
};

export default Pagination2;
