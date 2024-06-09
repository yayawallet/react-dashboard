interface Props {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder }: Props) => {
  return (
    <div className="">
      <form className="max-w-lg" onSubmit={(e) => e.preventDefault()}>
        <div className="relative max-w-80">
          <input
            type="search"
            id="search-dropdown"
            autoComplete="off"
            className="block p-2.5 w-full z-20 text-gray-900 bg-gray-50 rounded-lg border-e-gray-200 border-s-2 border border-gray-300 focus:ring-1 ring-violet-200 focus:border-violet-200 outline-none"
            placeholder={placeholder || 'Sender, Receiver, Cause, ID...'}
            onChange={(e) => onSearch(e.currentTarget.value)}
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-violet-500 rounded-e-lg border border-violet-500 hover:bg-violet-600 focus:ring-4 focus:outline-none focus:ring-violet-300"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
