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
import RefreshComponent from '../../components/ui/RefreshComponent';

const TransactionList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [copiedID, setCopiedID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: ownProfile } = useGetData('/user/profile');
  const ownAccount = ownProfile?.account;

  const {
    error,
    isLoading,
    data: { data: transactionList, lastPage: pageCount, total: totalTransactions, perPage } = {},
    mutate,
    isValidating,
  } = useGetData(`/transaction/find-by-user?p=${currentPage}`);

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

  return (
    <div className="table-container">
      {error || searchError ? (
        <Error />
      ) : isLoading && currentPage === 1 ? (
        <Loading />
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

            <div className="flex items-center justify-center p-4">
              <button
                id="dropdownDefault"
                data-dropdown-toggle="dropdown"
                className="text-white bg-yayaBrand-700 hover:bg-yayaBrand-800 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-yayaBrand-600 dark:hover:bg-yayaBrand-700 dark:focus:ring-yayaBrand-800"
                type="button"
              >
                Filter by date
                <svg
                  className="w-4 h-4 ml-2"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              <div
                id="dropdown"
                className="z-10 hiddenn w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
              >
                <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Category</h6>
                <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
                  <li className="flex items-center">
                    <input
                      id="canon"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-yayaBrand-600 focus:ring-yayaBrand-500 dark:focus:ring-yayaBrand-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />

                    <label
                      htmlFor="canon"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Canon (49)
                    </label>
                  </li>

                  <li className="flex items-center">
                    <input
                      id="microsoft"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-yayaBrand-600 focus:ring-yayaBrand-500 dark:focus:ring-yayaBrand-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />

                    <label
                      htmlFor="microsoft"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Microsoft (45)
                    </label>
                  </li>

                  <li className="flex items-center">
                    <input
                      id="razor"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-yayaBrand-600 focus:ring-yayaBrand-500 dark:focus:ring-yayaBrand-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />

                    <label
                      htmlFor="razor"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Razor (49)
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {(searchQuery && searchResult?.length === 0) || transactionList?.length === 0 ? (
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
