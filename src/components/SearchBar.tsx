interface Props {
  onSearch?: (query: string) => void;
  onSubmit?: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, onSubmit, placeholder }: Props) => {
  const handleOnFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = e.currentTarget?.search?.value;
    if (onSubmit) onSubmit(query);
  };

  return (
    <div className="">
      <form className="max-w-lg" onSubmit={(e) => handleOnFormSubmit(e)}>
        <div className="relative max-w-100">
          <input
            type="search"
            name="search"
            autoComplete="off"
            className="block p-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded border-e-gray-200 border-s-2 border border-gray-300 focus:ring-2 ring-gray-200 outline-none"
            placeholder={placeholder || 'ID, Sender, Receiver, Reason'}
            onChange={(e) => {
              if (onSearch) onSearch(e.currentTarget.value);
              if (onSubmit && e.currentTarget.value?.length === 0) onSubmit('');
            }}
          />
          <button
            type="submit"
            aria-label="search"
            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-yayaBrand-500 rounded-e border border-yayaBrand-500 hover:bg-yayaBrand-600 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300"
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
