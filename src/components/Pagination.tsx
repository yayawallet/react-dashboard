interface Props {
  page: number;
  pageCount: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

const Pagination = ({ page, pageCount, isLoading, onPageChange }: Props) => {
  return (
    <div className="my-4 flxe text-[15px] text-center">
      <button
        disabled={page === 1}
        className="inline-block text-gray-900 border border-slate-300 py-1 px-3 hover:bg-violet-50 disabled:opacity-50 rounded-tl rounded-bl"
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      <button className="inline-block border-y border-violet-500 py-1 px-5 bg-violet-500 text-white font-semibold">
        {isLoading ? '...' : page}
      </button>
      <button
        disabled={page >= pageCount}
        className="inline-block text-gray-900 border border-slate-300 py-1 px-3 hover:bg-violet-50 disabled:opacity-50 rounded-tr rounded-br"
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
