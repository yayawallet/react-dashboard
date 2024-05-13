import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import { Transaction } from '../../models';
import Loading from '../common/Loading';

const TransactionList = () => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [ownAccount, setOwnAccount] = useState('');
  const [copiedID, setCopiedID] = useState('');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/user/profile`)
      .then((res) => setOwnAccount(res.data.account));
  }, []);

  useEffect(() => {
    const endpoint = searchQuery ? 'search' : 'find-by-user';

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/transaction/${endpoint}`, {
        page: currentPage,
        query: searchQuery,
      })
      .then((res) => {
        setTransactionList(res.data.data);
        setPageCount(res.data.lastPage);
        setIsFetching(false);
      });
  }, [currentPage, searchQuery]);

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsFetching(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="-mx-4">
      <div className="ml-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="mt-2">
        <table className="w-full max-w-[1536px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-violet-500 text-gray-50">
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                ID
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Invoice
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Sender
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Amount
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Receiver
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Cause
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Date
              </th>
            </tr>
          </thead>

          {transactionList.length === 0 ? (
            <tbody className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
              <tr>
                <td>
                  <Loading />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {transactionList.map((t) => (
                <tr key={t?.id} className="hover:bg-gray-100">
                  <td
                    title={t?.id}
                    className="relative border-t border-b border-slate-200 p-3"
                    onClick={() => copyTransactionID(t?.id)}
                  >
                    {`${t?.id.slice(0, 4)}...${t?.id.slice(-2)}`}
                    <span
                      className={`${copiedID === t?.id ? '' : 'hidden'} absolute -top-2 left-4 w-40 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                    >
                      Transaction ID Copied
                    </span>
                  </td>
                  <td className="relative border-t border-b border-slate-200 p-3">
                    <button
                      type="button"
                      className="py-0.5 px-3 text-sm text-violet-900 focus:outline-none bg-white rounded-lg border border-violet-200 hover:bg-violet-100 hover:text-violet-700 focus:z-10 focus:ring-4 focus:ring-violet-100"
                    >
                      <a
                        href={`https://sandbox.yayawallet.com/en/invoice/transaction/${t.id}`}
                        target="_blank"
                      >
                        Print
                      </a>
                    </button>
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {t?.sender.name.split(' ').slice(0, 2).join(' ')}
                    <br />
                    <span
                      className="text-gray-500 text-sm block"
                      style={{ marginTop: '-3px' }}
                    >
                      {'@' + t?.sender.account}
                    </span>
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {ownAccount === t?.receiver.account ? (
                      <span className="inline-block ml-3  text-green-600">
                        &#43;&nbsp;
                      </span>
                    ) : (
                      <span className="inline-block ml-3 text-red-600">
                        &#8722;&nbsp;
                      </span>
                    )}
                    {t?.amount_with_currency}
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {t?.receiver.name.split(' ').slice(0, 2).join(' ')}
                    <br />
                    <span
                      className="text-gray-500 text-sm block"
                      style={{ marginTop: '-3px' }}
                    >
                      {'@' + t?.receiver.account}
                    </span>
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {`${t?.cause.slice(0, 16)}${t?.cause.charAt(17) ? '...' : ''}`}
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {`${new Date(Number(t?.created_at_time) * 1000).toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {pageCount > 1 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          isFetching={isFetching}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TransactionList;
