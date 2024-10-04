import { useEffect, useState } from 'react';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import { TransactionType } from '../../models';
import { useGetData, usePostData } from '../../hooks/useSWR';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { capitalize, formatDate } from '../../utils/table_utils';
import RefreshButton from '../../components/ui/RefreshButton';
import { MdCallMissedOutgoing } from 'react-icons/md';
import RefreshComponent from '../../components/ui/RefreshComponent';
import { IoIosArrowUp } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import { filter } from 'lodash';

const TransactionList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [copiedID, setCopiedID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openCustomFilter, setOpenCustomFilter] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [filterStartTime, setFilterStartTime] = useState(0);
  const [filterEndTime, setFilterEndTime] = useState(0);
  const [customFilterStartTime, setCustomFilterStartTime] = useState(0);
  const [customFilterEndTime, setCustomFilterEndTime] = useState(0);

  const { data: ownProfile } = useGetData('/user/profile');
  const ownAccount = ownProfile?.account;

  const {
    error,
    isLoading,
    data: {
      data: transactionList,
      lastPage: pageCount,
      total: totalTransactions,
      perPage,
      totalIncoming,
      totalOutgoing,
    } = {},
    mutate,
    isValidating,
  } = useGetData(
    `/transaction/find-by-user?p=${currentPage}${filterStartTime !== 0 ? `&start=${filterStartTime}` : ''}${filterEndTime !== 0 ? `&end=${filterEndTime}` : ''}`
  );

  const { data: { total: transactionListAll } = {} } = useGetData('transaction/find-by-user?p=1');

  const {
    error: searchError,
    isLoading: isSearching,
    data: { data: searchResult, total: totalSearchResult } = {},
  } = usePostData(['/transaction/search', searchQuery], {
    query: searchQuery,
  });

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchTransaction = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  const getCurrentTime = async () => {
    // const { data: { time: currentTime } = {} } = await axios.get(
    //   `${import.meta.env.VITE_GET_TIME_URL}`
    // );

    const currentTime = new Date().getTime();

    return currentTime;
  };

  const handleFilterByDate = async (value: string) => {
    setFilterValue(value);

    // Reset custom filter values
    setFilterStartTime(0);
    setFilterEndTime(0);

    if (value !== 'custom') setOpenCustomFilter(false);

    if (!value) return; // If no filter is selected, clear filter

    if (value === 'custom') {
      setFilterStartTime(customFilterStartTime);
      setFilterEndTime(customFilterEndTime);

      return;
    }

    if (value === '1D') {
      const currentTime = await getCurrentTime();
      const oneDayAgo = new Date(currentTime / 1000 - 24 * 60 * 60);

      setFilterStartTime(oneDayAgo.getTime());
      return;
    }

    if (value === '3D') {
      const currentTime = await getCurrentTime();
      const threeDaysAgo = new Date(currentTime / 1000 - 3 * 24 * 60 * 60);

      setFilterStartTime(threeDaysAgo.getTime());
      return;
    }

    if (value === '1W') {
      const currentTime = await getCurrentTime();
      const oneWeekAgo = new Date(currentTime / 1000 - 7 * 24 * 60 * 60);

      setFilterEndTime(oneWeekAgo.getTime());
      return;
    }

    if (value === '1M') {
      const currentTime = await getCurrentTime();
      const oneMonthAgo = new Date(currentTime / 1000 - 30 * 24 * 60 * 60);

      setFilterStartTime(oneMonthAgo.getTime());
      return;
    }
  };

  return (
    <div className="table-container">
      {error || searchError ? (
        <Error />
      ) : (
        <div className="border border-slate-200 rounded-xl">
          <div className="">
            <div className="flex flex-wrap justify-between items-center m-4">
              <div className="w-64">
                <SearchBar onSearch={(query) => handleSearchTransaction(query)} />
              </div>

              <div onClick={handleRefresh}>
                <RefreshButton />
              </div>
            </div>

            <div className="flex flex-wrap items-end my-6 ml-4 gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="text-gray-500 self-start">Filter by date</div>
                <div className="inline-flex px-4 py-1 gap-1 bg-gray-100 text-gray-800 text-[15px] rounded">
                  <button
                    className={`${filterValue === '1D' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
                    onClick={() => handleFilterByDate('1D')}
                    disabled={!transactionListAll}
                  >
                    1D
                  </button>
                  <button
                    className={`${filterValue === '3D' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
                    onClick={() => handleFilterByDate('3D')}
                    disabled={!transactionListAll}
                  >
                    3D
                  </button>
                  <button
                    className={`${filterValue === '1W' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
                    onClick={() => handleFilterByDate('1W')}
                    disabled={!transactionListAll}
                  >
                    1W
                  </button>
                  <button
                    className={`${filterValue === '1M' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
                    onClick={() => handleFilterByDate('1M')}
                    disabled={!transactionListAll}
                  >
                    1M
                  </button>
                  <button
                    className={`${filterValue === '' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
                    onClick={() => handleFilterByDate('')}
                    disabled={!transactionListAll}
                  >
                    All
                  </button>
                </div>
              </div>

              <div className="flex items-end gap-3">
                <button
                  className={`${filterValue === 'custom' ? 'bg-yayaBrand-600 hover:bg-yayaBrand-700 text-white' : 'text-gray-800 bg-gray-100'} flex items-center gap-1 cursor-pointer px-2.5 pt-1.5 pb-2 mb-0.5 rounded`}
                  onClick={() => {
                    setOpenCustomFilter(!openCustomFilter);
                    handleFilterByDate('custom');
                  }}
                  disabled={!transactionListAll}
                >
                  <span>Custom</span>
                  <span className="mt-1">
                    {openCustomFilter ? <IoIosArrowUp /> : <IoIosArrowForward />}
                  </span>
                </button>

                <div className={`${openCustomFilter ? '' : 'hidden'} flex items-center gap-4`}>
                  <div className="">
                    <label htmlFor="start" className="block mb-1 ml-2 text-sm font-medium">
                      From
                    </label>
                    <input
                      type="datetime-local"
                      id="start"
                      max={new Date().toISOString().replace(/:\d{2}\.\d{3}Z$/, '')}
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full px-2.5 py-1.5"
                      onChange={(e) =>
                        setCustomFilterStartTime(new Date(e.target.value).getTime() / 1000)
                      }
                    />
                  </div>

                  <div className="">
                    <label htmlFor="end" className="block mb-1 ml-2 text-sm font-medium">
                      To
                    </label>
                    <input
                      type="datetime-local"
                      id="end"
                      max={new Date().toISOString().replace(/:\d{2}\.\d{3}Z$/, '')}
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full px-2.5 py-1.5"
                      onChange={(e) =>
                        setCustomFilterEndTime(new Date(e.target.value).getTime() / 1000)
                      }
                    />
                  </div>

                  <button
                    className="self-end mb-1 text-white bg-yayaBrand-600 hover:bg-yayaBrand-700 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm px-5 pt-1 pb-1.5 text-center"
                    disabled={customFilterStartTime === 0 && customFilterEndTime === 0}
                    onClick={() => handleFilterByDate('custom')}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <div className={`${filterValue ? '' : 'hidden'} border p-2.5 mb-8 rounded-lg mx-4`}>
              <div className="text-gray-600 border-4 rounded-lg py-2 px-4 inline-block">
                <h3 className="text-xl font-semibold mb-2">
                  Transactions with in{' '}
                  {filterValue === '1D'
                    ? '1 Day'
                    : filterValue === '3D'
                      ? '3 Days'
                      : filterValue === '1W'
                        ? '1 Week'
                        : filterValue === '1M'
                          ? '1 Month'
                          : filterValue === 'custom'
                            ? `Custom Time`
                            : 'All Time'}
                </h3>

                <div>
                  Total Incoming:{' '}
                  <span className="text-gray-800 text-xl">
                    {isLoading ? (
                      '...'
                    ) : totalIncoming ? (
                      <span>
                        {totalIncoming} <span className="text-gray-500 text-base">ETB</span>
                      </span>
                    ) : (
                      '...'
                    )}
                  </span>
                </div>
                <div>
                  Total Outgoing:{' '}
                  <span className="text-gray-800 text-xl">
                    {isLoading ? (
                      '...'
                    ) : totalOutgoing ? (
                      <span>
                        {totalOutgoing} <span className="text-gray-500 text-base">ETB</span>
                      </span>
                    ) : (
                      '...'
                    )}
                  </span>
                </div>
                <div>
                  Total Number of Transactions:{' '}
                  <span className="text-gray-800 text-xl">
                    {isLoading ? '...' : totalTransactions}
                  </span>
                </div>
              </div>

              <div className=""></div>
            </div>
          </div>

          {isLoading && currentPage === 1 ? (
            <Loading />
          ) : (searchQuery && searchResult?.length === 0) || transactionList?.length === 0 ? (
            <EmptyList />
          ) : (
            <div className="relative">
              <RefreshComponent isRefreshing={isRefreshing || isValidating} />

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">ID</th>
                      <th className="text-left px-4 py-3 font-medium">Invoice</th>
                      <th className="text-left px-4 py-3 font-medium">Sender</th>
                      <th className="text-left px-4 py-3 font-medium">Amount</th>
                      <th className="text-left px-4 py-3 font-medium">Receiver</th>
                      <th className="text-left px-4 py-3 font-medium">Reason</th>
                      <th className="text-left px-4 py-3 font-medium">Created At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(searchQuery ? searchResult : transactionList).map((t: TransactionType) => (
                      <tr key={t?.id} className="hover:bg-slate-100 text-nowrap">
                        <td
                          title={t?.id}
                          className="relative border-b border-slate-200 p-3 cursor-pointer"
                          onClick={() => copyTransactionID(t?.id)}
                        >
                          {`${t?.id.slice(0, 6)}...${t?.id.slice(-2)}`}
                          <span
                            className={`${copiedID === t?.id ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                          >
                            Transaction ID Copied
                          </span>
                        </td>
                        <td className="relative border-b border-slate-200 p-3">
                          <button
                            type="button"
                            className="py-0.5 px-3 text text-yayaBrand-900 focus:outline-none bg-white rounded border border-yayaBrand-200 hover:bg-yayaBrand-100 hover:text-yayaBrand-700 focus:z-10 focus:ring-4 focus:ring-yayaBrand-100"
                          >
                            <a
                              href={`${import.meta.env.VITE_TRANSACTION_INVOICE_URL}/${t.id}`}
                              target="_blank"
                            >
                              Print
                            </a>
                          </button>
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          {capitalize(t?.sender.name).split(' ').slice(0, 2).join(' ')}
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          {t?.is_outgoing_transfer ? (
                            <span className="inline-block font-semibold text-red-600 -ml-1 mr-1">
                              <MdCallMissedOutgoing />
                            </span>
                          ) : ownAccount === t?.receiver.account ? (
                            <span className="inline-block font-semibold text-green-600">
                              &#43;&nbsp;
                            </span>
                          ) : (
                            <span className="inline-block font-semibold text-red-600">
                              &#8722;&nbsp;
                            </span>
                          )}
                          {t?.amount.toFixed(2)} <span className="text-gray-500 text-sm">ETB</span>
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          {capitalize(t?.receiver.name).split(' ').slice(0, 2).join(' ')}
                        </td>
                        <td className="border-b border-slate-200 p-3 text-wrap">
                          {t?.cause}
                          {/* {`${t?.cause.slice(0, 16)}${t?.cause.charAt(17) ? '...' : ''}`} */}
                        </td>
                        <td className="border-b border-slate-200 p-3 text-gray-500 tracking-normal">
                          {formatDate(t?.created_at_time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {searchQuery && (
                <div className="flex flex-wrap justify-between items-center px-5 bg-gray-100 rounded-t rounded-xl">
                  <p className="text-[15px] text-slate-700 py-4 font-semibold">
                    Search Result: {isSearching ? '...' : totalSearchResult}
                  </p>
                </div>
              )}

              {pageCount > 1 && !searchQuery && (
                <Pagination
                  currentPage={currentPage}
                  pageCount={pageCount}
                  total={totalTransactions}
                  perPage={perPage}
                  isLoading={isLoading}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
