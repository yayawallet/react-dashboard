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
import RefreshButton from '../../components/ui/RefreshButton';
import { useNavigate } from 'react-router-dom';

const ListBill = () => {
  const [prevList, setPrevList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedID, setCopiedID] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('');
  const [filteredBillList, setFilteredBillList] = useState<BillListType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate();

  const {
    error,
    isLoading,
    mutate,
    data: { data: billList, lastPage: pageCount } = {},
  } = usePostData(`/bill/list?p=${currentPage}`, {});

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  return (
    <div className="table-container">
      {error ? (
        <Error />
      ) : isLoading && !prevList ? (
        <Loading />
      ) : (
        <div className="border border-slate-200 rounded-xl">
          <div className="flex flex-wrap justify-between items-center m-4 text-[15px]">
            <div>
              Filter by:
              <button
                className={`mx-3 border bg-gray-50 text-gray-600 px-4 py-1 rounded cursor-pointer ${filterByStatus === 'paid' ? 'bg-violet-600 border-violet-600 text-white' : ''}`}
                onClick={() => handleFilterBill('paid')}
              >
                Paid
              </button>
              <button
                className={`border bg-gray-50 text-gray-600 px-4 py-1 rounded cursor-pointer ${filterByStatus === 'pending' ? 'bg-violet-600 border-violet-600 text-white' : ''}`}
                onClick={() => handleFilterBill('pending')}
              >
                Pending
              </button>
            </div>

            <div className="w-64">
              <SearchBar onSearch={(query) => handleSearchTransaction(query)} />
            </div>

            <div onClick={handleRefresh}>
              <RefreshButton />
            </div>
          </div>

          {filteredBillList.length === 0 && billList?.length === 0 ? (
            <EmptyList />
          ) : (
            <>
              <div className="overflow-auto relative">
                <div className={`${isRefreshing ? '' : 'hidden'}`}>
                  <div
                    className="absolute z-10 bg-white rounded-full p-2"
                    style={{
                      top: '30vh',
                      left: '50%',
                      transform: 'translate(-50%)',
                      boxShadow: '0 0 5px #888',
                    }}
                  >
                    <span
                      className="inline-block border-gray-400 h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    ></span>
                  </div>
                  <div className="absolute z-20 h-full w-full"></div>
                </div>

                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left pl-3 py-3 font-medium">ID</th>
                      <th className="text-left pl-3 py-3 font-medium">Customer Account</th>
                      <th className="text-left pl-3 py-3 font-medium">Cluster</th>
                      <th className="text-left pl-3 py-3 font-medium">Customer ID</th>
                      <th className="text-left pl-3 py-3 font-medium">Bill ID</th>
                      <th className="text-left pl-3 py-3 font-medium">Amount</th>
                      <th className="text-left pl-3 py-3 font-medium">Status</th>
                      <th className="text-left pl-3 py-3 font-medium">Due Date</th>
                      <th className="text-left pl-3 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(filterByStatus ? filteredBillList : billList)?.map((bill: BillListType) => (
                      <tr key={bill.id} className="hover:bg-slate-100 text-nowrap">
                        <td
                          title={bill.id}
                          className="relative border-b border-slate-200 pl-3 py-3 cursor-pointer"
                          onClick={() => copyTransactionID(bill.id)}
                        >
                          {`${bill.id.slice(0, 6)}...${bill.id.slice(-2)}`}
                          <span
                            className={`${copiedID === bill.id ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                          >
                            ID Copied
                          </span>
                        </td>

                        <td className="border-b border-slate-200 pl-3 py-3">
                          {bill.customer_yaya_account ? (
                            bill.customer_yaya_account?.account
                          ) : (
                            <span className="text-gray-500">unavailable</span>
                          )}
                        </td>

                        <td className="border-b border-slate-200 pl-3 py-3">
                          {bill.cluster ? (
                            capitalize(bill.cluster)
                          ) : (
                            <span className="text-gray-500">unavailable</span>
                          )}
                        </td>

                        <td className="border-b border-slate-200 pl-3 py-3">{bill.customer_id}</td>

                        <td className="border-b border-slate-200 pl-3 py-3">{bill.bill_id}</td>

                        <td className="border-b border-slate-200 pl-3 py-3">
                          {bill.amount?.toFixed(2)}{' '}
                          <span className="text-gray-500 text-sm">{bill.currency}</span>
                        </td>

                        <td className="border-b border-slate-200 pl-3 py-3">
                          <span
                            className={`inline-block align-middle pb-0.5 pr-1 text-[16px] text-${bill.status == 'PAID' ? 'green' : 'orange'}-500`}
                          >
                            <GoDotFill />
                          </span>
                          {capitalize(bill.status)}
                        </td>

                        <td className="border-b border-slate-200 pl-3 py-3 text-gray-500">
                          {formatDate(bill.due_at).split('-')[0]}
                        </td>

                        <td className="relative border-b border-slate-200 pl-3 py-3">
                          <button
                            type="button"
                            className="pt-0.5 pb-1 px-3 focus:outline-none text-black bg-yellow-400 rounded hover:bg-yellow-500 focus:z-10 focus:ring-4 focus:ring-yellow-200"
                            onClick={() => {
                              navigate('/bill/update/' + bill.bill_id);
                            }}
                          >
                            Update
                          </button>
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
