import { useEffect, useState } from 'react';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import { TRANSACTION_INVOICE_URL } from '../../CONSTANTS';
import { Transaction } from '../../models';
import { useGetData, usePostData } from '../../hooks/useSWR';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { capitalize, formatDate } from '../../utils/table_utils';

const TransactionList = () => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [prevList, setPrevList] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedID, setCopiedID] = useState('');

  const { data: ownProfile } = useGetData('/user/profile');
  const ownAccount = ownProfile?.account;

  const {
    error,
    isLoading,
    data: transactionData,
  } = useGetData(`/transaction/find-by-user?p=${currentPage}`);

  const { data: searchResult } = usePostData(['/transaction/search', searchQuery], {
    query: searchQuery,
  });

  useEffect(() => {
    if (transactionData) {
      setTransactionList(transactionData.data);
      setPageCount(transactionData.lastPage);
      setPrevList(true);
    }
  }, [transactionData]);

  useEffect(() => {
    if (searchResult) {
      setTransactionList(searchResult.data);
    }
  }, [searchResult]);

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

  return (
    <div className="table-container">
      {error ? (
        <Error />
      ) : isLoading && !prevList ? (
        <Loading />
      ) : (
        <div className="border border-slate-200 rounded-xl">
          <div className="flex flex-wrap justify-between items-center m-4">
            <h3 className="text-lg font-medium">Transactions</h3>
            <div className="w-64">
              <SearchBar onSearch={(query) => handleSearchTransaction(query)} />
            </div>
          </div>

          {transactionList?.length === 0 ? (
            <EmptyList />
          ) : (
            <>
              <div className="overflow-auto">
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
                    {transactionList.map((t) => (
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
                            className="py-0.5 px-4 text text-violet-900 focus:outline-none bg-white rounded border border-violet-200 hover:bg-violet-100 hover:text-violet-700 focus:z-10 focus:ring-4 focus:ring-violet-100"
                          >
                            <a href={`${TRANSACTION_INVOICE_URL}/${t.id}`} target="_blank">
                              Print
                            </a>
                          </button>
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          {capitalize(t?.sender.name).split(' ').slice(0, 2).join(' ')}
                          {/* <br />
                          <span
                            className="text-gray-500 text-xs block"
                            style={{ marginTop: '-3px' }}
                          >
                            {'@' + t?.sender.account}
                          </span> */}
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
                          {/* <br />
                          <span
                            className="text-gray-500 text-xs block"
                            style={{ marginTop: '-3px' }}
                          >
                            {'@' + t?.receiver.account}
                          </span> */}
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
                <div className="flex flex-wrap justify-between items-center px-5 bg-slate-50 rounded-t rounded-xl">
                  <p className="text-[15px] text-slate-700">
                    Showing {isLoading ? '...' : (currentPage - 1) * 15 + 1} to{' '}
                    {isLoading ? '...' : currentPage * 15} of {pageCount * 15} entries
                  </p>
                  <Pagination
                    page={currentPage}
                    pageCount={pageCount}
                    isLoading={isLoading}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
