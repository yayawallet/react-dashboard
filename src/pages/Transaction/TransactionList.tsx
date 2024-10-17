import { useState } from 'react';
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
import { RxExternalLink } from 'react-icons/rx';
import RefreshComponent from '../../components/ui/RefreshComponent';
import FilterByDateResult from '../../components/FilterByDateResult';
import FilterByDate from '../../components/FilterByDate';
import PageLoading from '../../components/ui/PageLoading';
import axios from 'axios';

const TransactionList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [copiedID, setCopiedID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterValue, setFilterValue] = useState('all');
  const [filterStartTime, setFilterStartTime] = useState(0);
  const [filterEndTime, setFilterEndTime] = useState(0);
  const [customFilterStartTime, setCustomFilterStartTime] = useState(0);
  const [customFilterEndTime, setCustomFilterEndTime] = useState(0);
  const [isFetchingCurrentTime, setIsFetchingCurrentTime] = useState(false);

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
      incomingSum,
      outgoingSum,
    } = {},
    mutate,
    isValidating,
  } = useGetData(
    `/transaction/find-by-user?p=${currentPage}${filterStartTime !== 0 ? `&start=${filterStartTime}` : ''}${filterEndTime !== 0 ? `&end=${filterEndTime}` : ''}`
  );

  const { data: { total: transactionListTotal } = {} } = useGetData('transaction/find-by-user?p=1');

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

  const handleCustomStartTime = (time: number) => {
    setCustomFilterStartTime(time);
  };

  const handleCustomEndTime = (time: number) => {
    setCustomFilterEndTime(time);
  };

  const getCurrentTime = async () => {
    setIsFetchingCurrentTime(true);

    const { data: { time: currentTime } = {} } = await axios.get(`${window.env.GET_TIME_URL}`);

    setIsFetchingCurrentTime(false);

    return currentTime;
  };

  const handleFilterByDate = async (value: string) => {
    setFilterValue(value);

    // Reset custom filter values
    setFilterStartTime(0);
    setFilterEndTime(0);

    if (value !== 'custom') {
      setCustomFilterEndTime(0);
      setCustomFilterStartTime(0);
    }

    if (value === 'custom') {
      setFilterStartTime(customFilterStartTime);
      setFilterEndTime(customFilterEndTime);
      return;
    }

    if (value === 'all') return; // If no filter is selected, clear filter

    const currentTime = (await getCurrentTime()) / 1000; // convert miliseconds to seconds

    if (value === '1D') {
      const oneDayAgo = new Date(currentTime - 24 * 60 * 60);

      setFilterStartTime(oneDayAgo.getTime());
      return;
    }

    if (value === '3D') {
      const threeDaysAgo = new Date(currentTime - 3 * 24 * 60 * 60);

      setFilterStartTime(threeDaysAgo.getTime());
      return;
    }

    if (value === '1W') {
      const oneWeekAgo = new Date(currentTime - 7 * 24 * 60 * 60);

      setFilterStartTime(oneWeekAgo.getTime());
      return;
    }

    if (value === '1M') {
      const oneMonthAgo = new Date(currentTime - 30 * 24 * 60 * 60);

      setFilterStartTime(oneMonthAgo.getTime());
      return;
    }
  };

  if (transactionListTotal === undefined) return <PageLoading />; // Page is loading

  return (
    <div className="table-container">
      {error || searchError ? (
        <Error />
      ) : (
        <div className="border border-slate-200 rounded-xl">
          <div className="">
            <div className="flex flex-wrap gap-2 justify-between items-center m-3 mb-0">
              <h3 className="py-2 text-lg font-medium">Transaction List</h3>
              <div onClick={handleRefresh}>
                <RefreshButton />
              </div>
            </div>

            <div className="flex items-center justify-between gap-5 flex-wrap mb-10">
              <FilterByDate
                filterValue={filterValue}
                transactionListTotal={transactionListTotal}
                customFilterStartTime={customFilterStartTime}
                customFilterEndTime={customFilterEndTime}
                onFilterByDate={handleFilterByDate}
                onCustomStartTime={handleCustomStartTime}
                onCustomEndTime={handleCustomEndTime}
              />

              <div className="w-64 mx-3 self-end">
                <SearchBar onSearch={(query) => handleSearchTransaction(query)} />
              </div>
            </div>

            <div className="mb-10">
              <FilterByDateResult
                filterValue={filterValue}
                isLoading={isLoading || isFetchingCurrentTime}
                incomingSum={incomingSum}
                outgoingSum={outgoingSum}
                totalTransactions={totalTransactions}
                transactionLIstTotal={transactionListTotal}
                customFilterStartTime={customFilterStartTime}
                customFilterEndTime={customFilterEndTime}
              />
            </div>
          </div>

          {(isLoading && currentPage === 1) || isFetchingCurrentTime ? (
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
                            className="py-0.5 px-3 text text-yaya-800 focus:outline-none bg-white rounded border border-yaya-200 hover:bg-yaya-50 hover:text-yaya-700 focus:z-10 focus:ring-4 focus:ring-yaya-100"
                          >
                            <a
                              href={`${window.env.TRANSACTION_INVOICE_URL}/${t.id}`}
                              target="_blank"
                              className="flex items-center hover:underline hover:text-yaya-900"
                            >
                              Print{' '}
                              <span className="text- text-sm ml-1 mt-0.5">
                                <RxExternalLink />
                              </span>
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
