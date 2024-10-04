import { IoIosArrowForward, IoIosArrowUp } from 'react-icons/io';

interface Props {
  filterValue: string;
  transactionListAll: number;
  openCustomFilter: boolean;
  customFilterStartTime: number;
  customFilterEndTime: number;
  onFilterByDate: (value: string) => void;
  onCustomStartTime: (startTime: number) => void;
  onCustomEndTime: (endTime: number) => void;
}

const FilterByDate = ({
  filterValue,
  transactionListAll,
  openCustomFilter,
  customFilterStartTime,
  customFilterEndTime,
  onFilterByDate,
  onCustomStartTime,
  onCustomEndTime,
}: Props) => {
  return (
    <div className="flex flex-wrap items-end mt-6 mb-10 ml-4 gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="text-gray-500 self-start">Filter by date</div>
        <div className="inline-flex flex-wrap px-4 py-1 gap-1 bg-gray-100 text-gray-800 text-[15px] rounded">
          <button
            className={`${filterValue === '1D' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
            onClick={() => onFilterByDate('1D')}
            disabled={!transactionListAll}
          >
            1D
          </button>
          <button
            className={`${filterValue === '3D' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
            onClick={() => onFilterByDate('3D')}
            disabled={!transactionListAll}
          >
            3D
          </button>
          <button
            className={`${filterValue === '1W' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
            onClick={() => onFilterByDate('1W')}
            disabled={!transactionListAll}
          >
            1W
          </button>
          <button
            className={`${filterValue === '1M' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
            onClick={() => onFilterByDate('1M')}
            disabled={!transactionListAll}
          >
            1M
          </button>
          <button
            className={`${filterValue === '' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
            onClick={() => onFilterByDate('')}
            disabled={!transactionListAll}
          >
            All
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <button
          className={`${filterValue === 'custom' ? 'bg-yayaBrand-600 hover:bg-yayaBrand-700 text-white' : 'text-gray-800 bg-gray-100'} flex items-center gap-1 cursor-pointer px-2.5 pt-1.5 pb-2 mb-0.5 rounded`}
          onClick={() => onFilterByDate('custom')}
          disabled={!transactionListAll}
        >
          <span>Custom</span>
          <span className="mt-1">
            {openCustomFilter ? <IoIosArrowUp /> : <IoIosArrowForward />}
          </span>
        </button>

        <div className={`${openCustomFilter ? '' : 'hidden'} flex flex-wrap items-center gap-4`}>
          <div className="">
            <label htmlFor="start" className="block mb-1 ml-2 text-sm font-medium">
              From
            </label>
            <input
              type="datetime-local"
              id="start"
              max={new Date().toISOString().replace(/:\d{2}\.\d{3}Z$/, '')}
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full px-2.5 py-1.5"
              onChange={(e) => onCustomStartTime(new Date(e.target.value).getTime() / 1000)}
            />
          </div>

          <div className="">
            <label htmlFor="end" className="block mb-1 ml-2 text-sm font-medium">
              To
            </label>
            <input
              type="datetime-local"
              id="end"
              min={
                customFilterStartTime
                  ? new Date(customFilterStartTime * 1000 + 1000)
                      .toISOString()
                      .replace(/:\d{2}\.\d{3}Z$/, '')
                  : 0
              }
              max={new Date().toISOString().replace(/:\d{2}\.\d{3}Z$/, '')}
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full px-2.5 py-1.5"
              onChange={(e) => onCustomEndTime(new Date(e.target.value).getTime() / 1000)}
            />
          </div>

          <button
            className="self-end mb-1 text-white bg-yayaBrand-600 hover:bg-yayaBrand-700 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm px-5 pt-1 pb-1.5 text-center"
            disabled={customFilterStartTime === 0 && customFilterEndTime === 0}
            onClick={() => onFilterByDate('custom')}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterByDate;
