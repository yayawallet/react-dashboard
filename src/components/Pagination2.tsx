interface Props {
  currentPage: number;
  pageCount: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

const Pagination = ({ currentPage, pageCount, isLoading, onPageChange }: Props) => {
  return (
    <div className="my-4 flxe text-[15px] text-center">
      <button
        disabled={currentPage === 1}
        className="inline-block text-gray-900 border border-slate-300 py-1 px-3 hover:bg-yayaBrand-50 disabled:opacity-50 rounded-tl rounded-bl"
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      <button className="inline-block border-y border-yayaBrand-500 py-1 px-5 bg-yayaBrand-500 text-white font-semibold">
        {isLoading ? '...' : currentPage}
      </button>
      <button
        disabled={currentPage >= pageCount}
        className="inline-block text-gray-900 border border-slate-300 py-1 px-3 hover:bg-yayaBrand-50 disabled:opacity-50 rounded-tr rounded-br"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
