import { useState } from 'react';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import { BillListType } from '../../models';
import { usePostData } from '../../hooks/useSWR';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { capitalize, formatDate } from '../../utils/table_utils';
import { GoDotFill } from 'react-icons/go';

const ListBill = () => {
  const [prevList, setPrevList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedID, setCopiedID] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('');
  const [filteredBillList, setFilteredBillList] = useState<BillListType[]>([]);

  const {
    error,
    isLoading,
    data: { data: billList, lastPage: pageCount } = {},
  } = usePostData('/bill/list', {});

  console.log(billList);

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

  const handleFilterBill = (status: string) => {
    setFilterByStatus((prev) => (prev === status ? '' : status));

    setFilteredBillList(
      billList?.filter((item: BillListType) =>
        status ? item.status === status.toUpperCase() : true
      )
    );
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
            <div className="">
              Filter by:
              <span
                className={`inline-flex items-center border bg-gray-100 text-gray-500 px-4 pb-1.5 pt-1 rounded mx-2 cursor-pointer ${filterByStatus === 'paid' ? 'bg-violet-600 text-white' : ''}`}
                onClick={() => handleFilterBill('paid')}
              >
                Paid
              </span>
              <span
                className={`inline-flex items-center border bg-gray-100 text-gray-500 px-4 pb-1.5 pt-1 rounded mx-2 cursor-pointer ${filterByStatus === 'pending' ? 'bg-violet-600 text-white' : ''}`}
                onClick={() => handleFilterBill('pending')}
              >
                Pending
              </span>
            </div>

            <div className="w-64">
              <SearchBar onSearch={(query) => handleSearchTransaction(query)} />
            </div>
          </div>

          {filteredBillList.length === 0 && billList?.length === 0 ? (
            <EmptyList />
          ) : (
            <>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">ID</th>
                      <th className="text-left px-4 py-3 font-medium"></th>
                      <th className="text-left px-4 py-3 font-medium">Client YaYa Account</th>
                      <th className="text-left px-4 py-3 font-medium">Customer ID</th>
                      <th className="text-left px-4 py-3 font-medium">Bill ID</th>
                      <th className="text-left px-4 py-3 font-medium">Amount</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Due Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(filterByStatus ? filteredBillList : billList)?.map((t: BillListType) => (
                      <tr key={t.id} className="hover:bg-slate-100 text-nowrap">
                        <td
                          title={t.id}
                          className="relative border-b border-slate-200 p-3 cursor-pointer"
                          onClick={() => copyTransactionID(t.id)}
                        >
                          {`${t.id.slice(0, 6)}...${t.id.slice(-2)}`}
                          <span
                            className={`${copiedID === t.id ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                          >
                            ID Copied
                          </span>
                        </td>
                        <td className="relative border-b border-slate-200 p-3">
                          <button
                            type="button"
                            className="pt-0.5 pb-1 px-3 text text-violet-900 focus:outline-none bg-white rounded border border-violet-200 hover:bg-violet-100 hover:text-violet-700 focus:z-10 focus:ring-4 focus:ring-violet-100"
                          >
                            Detail
                          </button>
                        </td>

                        <td className="border-b border-slate-200 p-3">
                          {t.customer_yaya_account ? (
                            capitalize(t.customer_yaya_account?.name)
                              .split(' ')
                              .slice(0, 2)
                              .join(' ')
                          ) : (
                            <span className="text-gray-500">unavailable</span>
                          )}
                        </td>

                        <td className="border-b border-slate-200 p-3">
                          {capitalize(t.customer_id)}
                        </td>

                        <td className="border-b border-slate-200 p-3">{capitalize(t.bill_id)}</td>

                        <td className="border-b border-slate-200 p-3">
                          {t.amount?.toFixed(2)}{' '}
                          <span className="text-gray-500 text-sm">{t.currency}</span>
                        </td>

                        <td className="border-b border-slate-200 p-3">
                          <span
                            className={`inline-block align-middle pb-0.5 pr-1 text-[16px] text-${t.status == 'PAID' ? 'green' : 'orange'}-500`}
                          >
                            <GoDotFill />
                          </span>
                          {capitalize(t.status)}
                        </td>

                        <td className="border-b border-slate-200 p-3 text-gray-500">
                          {formatDate(t.due_at).split('-')[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pageCount > 1 && (
                <div className="flex flex-wrap justify-between items-center px-5 bg-gray-100 rounded-t rounded-xl">
                  <p className="text-[15px] text-slate-700 py-4">
                    Showing {isLoading ? '...' : (currentPage - 1) * 15 + 1} to{' '}
                    {isLoading ? '...' : currentPage * 15} of {pageCount * 15} entries
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ListBill;
