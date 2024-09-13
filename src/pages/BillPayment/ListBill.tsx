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
import SearchBar from '../../components/SearchBar';
import { authAxios } from '../../api/axios';
import UpdateBillModal from './UpdateBillModal';
import RefreshComponent from '../../components/ui/RefreshComponent';

const ListBill = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedID, setCopiedID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchBillID, setSearchBillID] = useState<string | null>(null);
  const [foundBill, setFoundBill] = useState<BillDetailType | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [billToUpdate, setBillToUpdate] = useState<BillListType | null>(null);

  const { data: { account: ownAccount } = {} } = useGetData('/user/profile');

  const {
    error,
    isLoading,
    mutate,
    isValidating,
    data: { data: billList, lastPage: pageCount, total: totalBills, perPage } = {},
  } = usePostData(`/bill/list?p=${currentPage}`, {});

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchBill = (bill_id: string) => {
    setSearchBillID(bill_id);
    if (!bill_id) return;

    setIsSearching(true);
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

  const handleUpdateBill = (bill: BillListType) => {
    setOpenUpdateModal(true);
    setBillToUpdate(bill);
  };

  const handleOnCloseUpdate = (status: boolean) => {
    if (status) mutate();

    setOpenUpdateModal(false);
  };

  return (
    <div className="table-container">
      <UpdateBillModal
        bill={billToUpdate}
        openUpdateModal={openUpdateModal}
        onCancelUpdate={(status) => handleOnCloseUpdate(status)}
      />

      {error ? (
        <Error />
      ) : isLoading && currentPage === 1 ? (
        <Loading />
      ) : (
        <div className="border border-gray-200 rounded-xl">
          <div className="flex flex-wrap justify-between items-center m-4 text-[15px]">
            <div className="w-64">
              <SearchBar
                placeholder="Search by Bill ID"
                onSubmit={(bill_id) => handleSearchBill(bill_id)}
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
              <RefreshComponent isRefreshing={isRefreshing || isValidating} />

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left pl-3 py-3 font-medium">ID</th>
                      <th className="text-left pl-3 py-3 font-medium">Client</th>
                      <th className="text-left pl-3 py-3 font-medium">Cluster</th>
                      <th className="text-left pl-3 py-3 font-medium">Customer Account</th>
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
                        <tr
                          key={bill.id}
                          className={`text-nowrap ${new Date(bill.due_at) < new Date() ? 'bg-red-100 hover:bg-red-100' : 'hover:bg-gray-100'}`}
                          title={`${bill.client_yaya_account.name}\nClient yaya account: ${bill.client_yaya_account.account}\n${bill.bill_code && `Bill code: ${bill.bill_code} \n`}${bill.bill_season && `Bill season: ${bill.bill_season} \n`}${bill.description && `Description: ${bill.description}\n`}${bill.customer_id && `Customer Id: ${bill.customer_id}\n`}${bill.phone && `Phone: ${bill.phone}\n`}${bill.email && `Email: ${bill.email}`}`}
                        >
                          <td
                            title={bill.id}
                            className="relative border-b border-gray-200 pl-3 py-3 cursor-pointer"
                            onClick={() => copyTransactionID(bill.id)}
                          >
                            {`${bill.id.slice(0, 6)}...${bill.id.slice(-2)}`}
                            <span
                              className={`${copiedID === bill.id ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                            >
                              ID Copied
                            </span>
                          </td>

                          <td className="border-b border-gray-200 pl-3 py-3 text-gray-500">
                            @{bill.client_yaya_account.account}
                          </td>

                          <td className="border-b border-gray-200 pl-3 py-3">
                            {bill.cluster ? capitalize(bill.cluster) : ''}
                          </td>

                          <td className="border-b border-gray-200 pl-3 py-3">
                            {bill.customer_yaya_account ? (
                              bill.customer_yaya_account?.account
                            ) : (
                              <span className="text-gray-500">unavailable</span>
                            )}
                          </td>

                          <td className="border-b border-gray-200 pl-3 py-3">{bill.bill_id}</td>

                          <td className="border-b border-gray-200 pl-3 py-3">
                            {bill.amount?.toFixed(2)}{' '}
                            <span className="text-gray-500 text-sm">{bill.currency}</span>
                          </td>

                          <td className="border-b border-gray-200 pl-3 py-3">
                            <span
                              className={`inline-block align-middle pb-0.5 pr-1 text-[16px] text-${bill.status == 'PAID' ? 'green' : 'orange'}-500`}
                            >
                              <GoDotFill />
                            </span>
                            {capitalize(bill.status || 'pending')}
                          </td>

                          <td className="border-b border-gray-200 pl-3 py-3 text-gray-500 tracking-normal">
                            {formatDate(bill.due_at).split('-')[0]}
                          </td>

                          <td className="relative border-b border-gray-200 pl-3 py-3">
                            <button
                              type="button"
                              disabled={bill.status === 'PAID'}
                              className="pt-0.5 pb-1 px-3 focus:outline-none text-black bg-yellow-400 rounded hover:bg-yellow-500 focus:z-10 focus:ring-4 focus:ring-yellow-300"
                              onClick={() => handleUpdateBill(bill)}
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
                <Pagination
                  currentPage={currentPage}
                  pageCount={pageCount}
                  total={totalBills}
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

export default ListBill;
