import { useState } from 'react';
import Pagination from '../../components/Pagination';
import { BillDetailType, BillListType } from '../../models';
import { useGetData, usePostData } from '../../hooks/useSWR';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { capitalize, formatDate } from '../../utils/table_utils';
import { GoDotFill } from 'react-icons/go';
import RefreshButton from '../../components/ui/RefreshButton';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import { authAxios } from '../../api/axios';

const ListBill = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedID, setCopiedID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchBillID, setSearchBillID] = useState<string | null>(null);
  const [foundBill, setFoundBill] = useState<BillDetailType | null>(null);

  const { data: { account: ownAccount } = {} } = useGetData('/user/profile');

  const navigate = useNavigate();

  const {
    error,
    isLoading,
    mutate,
    data: { data: billList, lastPage: pageCount, total: totalBills } = {},
  } = usePostData(`/bill/list?p=${currentPage}`, {});

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchTransaction = (bill_id: string) => {
    setIsSearching(true);
    setSearchBillID(bill_id);

    authAxios
      .post('/bill/find', { client_yaya_account: ownAccount, bill_id })
      .then((res) => setFoundBill(res.data))
      .catch(() => setFoundBill(null))
      .finally(() => setIsSearching(false));
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
      ) : isLoading && currentPage === 1 ? (
        <Loading />
      ) : (
        <div className="border border-slate-200 rounded-xl">
          <div className="flex flex-wrap justify-between items-center m-4 text-[15px]">
            <div className="w-64">
              <SearchBar
                placeholder="Search by Bill ID"
                onSearch={(bill_id) => handleSearchTransaction(bill_id)}
              />
            </div>

            <div onClick={handleRefresh}>
              <RefreshButton />
            </div>
          </div>

          {(searchBillID && !isSearching && !foundBill?.id) || billList?.length === 0 ? (
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
                    {(searchBillID && !isSearching ? [foundBill] : billList)?.map(
                      (bill: BillListType) => (
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

                          <td className="border-b border-slate-200 pl-3 py-3">
                            {bill.customer_id}
                          </td>

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
                            {capitalize(bill.status || 'pending')}
                          </td>

                          <td className="border-b border-slate-200 pl-3 py-3 text-gray-500">
                            {formatDate(bill.due_at).split('-')[0]}
                          </td>

                          <td className="relative border-b border-slate-200 pl-3 py-3">
                            <button
                              type="button"
                              disabled={bill.status === 'PAID'}
                              className="pt-0.5 pb-1 px-3 focus:outline-none text-black bg-yellow-400 rounded hover:bg-yellow-500 focus:z-10 focus:ring-4 focus:ring-yellow-300"
                              onClick={() => {
                                navigate('/bill/update/' + bill.bill_id);
                              }}
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              {pageCount > 1 && !searchBillID && (
                <div className="flex flex-wrap justify-between items-center px-5 bg-gray-100 rounded-t rounded-xl">
                  <p className="text-[15px] text-slate-700 py-4">
                    {
                      <span>
                        Showing {isLoading ? '...' : (currentPage - 1) * 15 + 1} to{' '}
                        {isLoading
                          ? '...'
                          : currentPage === pageCount
                            ? totalBills
                            : currentPage * 15}{' '}
                        of {totalBills} entries
                      </span>
                    }
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListBill;