import { useState } from 'react';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import { TRANSACTION_INVOICE_URL } from '../../CONSTANTS';
import { TransactionType } from '../../models';
import { useGetData, usePostData } from '../../hooks/useSWR';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { capitalize, formatDate } from '../../utils/table_utils';
import RefreshButton from '../../components/ui/RefreshButton';

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
    data: { data: transactionList, lastPage: pageCount, total: totalTransactions } = {},
    mutate,
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
          <div className="flex flex-wrap justify-between items-center m-4">
            <div className="w-64">
              <SearchBar onSearch={(query) => handleSearchTransaction(query)} />
            </div>

            <div onClick={handleRefresh}>
              <RefreshButton />
            </div>
          </div>

          {(searchQuery && searchResult?.length === 0) || transactionList?.length === 0 ? (
            <EmptyList />
          ) : (
            <div className="relative">
              <div className={`${isRefreshing ? '' : 'hidden'}`}>
                <div
                  className="absolute z-10 bg-white rounded-full p-1.5"
                  style={{
                    top: '30vh',
                    left: '50%',
                    transform: 'translate(-50%)',
                    boxShadow: '0 0 5px #888',
                  }}
                >
                  <span
                    className="inline-block border-gray-400 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  ></span>
                </div>
                <div className="absolute z-20 h-full w-full"></div>
              </div>

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
                      <th className="text-left px-4 py-3 font-medium">Date</th>
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
                            className="pt-0.5 pb-1 px-3 text text-violet-900 focus:outline-none bg-white rounded border border-violet-200 hover:bg-violet-100 hover:text-violet-700 focus:z-10 focus:ring-4 focus:ring-violet-100"
                          >
                            <a href={`${TRANSACTION_INVOICE_URL}/${t.id}`} target="_blank">
                              Print
                            </a>
                          </button>
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          {capitalize(t?.sender.name).split(' ').slice(0, 2).join(' ')}
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          {ownAccount === t?.receiver.account ? (
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
                        <td className="border-b border-slate-200 p-3">
                          {`${t?.cause.slice(0, 16)}${t?.cause.charAt(17) ? '...' : ''}`}
                        </td>
                        <td className="border-b border-slate-200 p-3 text-gray-500">
                          {formatDate(t?.created_at_time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pageCount > 1 && (
                <div className="flex flex-wrap justify-between items-center px-5 bg-gray-100 rounded-t rounded-xl">
                  <p className="text-[15px] text-slate-700 py-4">
                    {searchQuery ? (
                      <span>
                        Search Result{' '}
                        <span className="font-semibold">
                          {isSearching ? '...' : totalSearchResult}
                        </span>
                      </span>
                    ) : (
                      <span>
                        Showing {isLoading ? '...' : (currentPage - 1) * 15 + 1} to{' '}
                        {isLoading
                          ? '...'
                          : currentPage === pageCount
                            ? totalTransactions
                            : currentPage * 15}{' '}
                        of {totalTransactions} entries
                      </span>
                    )}
                  </p>
                  <div className={`${searchQuery ? 'hidden' : ''}`}>
                    <Pagination
                      currentPage={currentPage}
                      pageCount={pageCount}
                      isLoading={isLoading}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
