interface Props {
  page: number;
  pageCount: number;
  isPending: boolean;
  onPageChange: (newPage: number) => void;
}

const Pagination = ({ page, pageCount, isPending, onPageChange }: Props) => {
  return (
    <div className="my-10 flxe text-center text-lg">
      <button
        disabled={page === 1}
        className="inline-block text-gray-900 border border-slate-300 py-1 px-4 hover:bg-violet-50 disabled:opacity-50 rounded-tl rounded-bl"
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      <button className="inline-block border-y border-violet-500 py-1 px-6 bg-violet-500 text-white">
        {isPending ? '...' : page}
      </button>
      <button
        disabled={page >= pageCount}
        className="inline-block text-gray-900 border border-slate-300 py-1 px-4 hover:bg-violet-50 disabled:opacity-50 rounded-tr rounded-br"
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
