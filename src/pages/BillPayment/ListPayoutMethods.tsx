import { useState } from 'react';
import Pagination from '../../components/Pagination';
import { PayoutMethodType } from '../../models';
import { usePostData } from '../../hooks/useSWR';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { capitalize, formatDate } from '../../utils/table_utils';
import RefreshButton from '../../components/ui/RefreshButton';
import { authAxios } from '../../api/axios';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ProcessingModal from '../../components/modals/ProcessingModal';
import RefreshComponent from '../../components/ui/RefreshComponent';

const ListPayoutMethods = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedID, setCopiedID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedID, setSelectedID] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    error,
    isLoading,
    mutate,
    isValidating,
    data: { data: payoutMethodsList, lastPage: pageCount, total: totalPayoutMethods, perPage } = {},
  } = usePostData(`/payout-method/list?p=${currentPage}`, {});

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeletePayout = async (confirm: boolean) => {
    setOpenModal(false);
    if (!confirm) return;

    setIsProcessing(true);

    await authAxios
      .delete(`/payout-method/delete/${selectedID}`)
      .then(() => mutate())
      .finally(() => setIsProcessing(false));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  return (
    <div className="table-container">
      <ConfirmationModal
        header="Are you sure you want to delete?"
        openModal={openModal}
        onConfirm={handleDeletePayout}
      />
      <ProcessingModal isProcessing={isProcessing} />

      {error ? (
        <Error />
      ) : isLoading && currentPage === 1 ? (
        <Loading />
      ) : (
        <div className="border border-slate-200 rounded-xl">
          <div className="flex flex-wrap justify-between items-center m-4 text-[15px]">
            <h3 className="text-lg font-medium">Payout Methods</h3>

            <div onClick={handleRefresh}>
              <RefreshButton />
            </div>
          </div>

          {payoutMethodsList?.length === 0 ? (
            <EmptyList />
          ) : (
            <div className="relative">
              <RefreshComponent isRefreshing={isRefreshing || isValidating} />

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left pl-3 py-3 font-medium">ID</th>
                      <th className="text-left pl-3 py-3 font-medium">Cluster</th>
                      <th className="text-left pl-3 py-3 font-medium">Bill Code</th>
                      <th className="text-left pl-3 py-3 font-medium">Institution</th>
                      <th className="text-left pl-3 py-3 font-medium">Account Number</th>
                      <th className="text-left pl-3 py-3 font-medium">Created At</th>
                      <th className="text-left pl-3 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {payoutMethodsList?.map((payout: PayoutMethodType) => (
                      <tr key={payout.id} className="hover:bg-slate-100 text-nowrap">
                        <td
                          title={payout.id}
                          className="relative border-b border-slate-200 pl-3 py-3 cursor-pointer"
                          onClick={() => copyTransactionID(payout.id)}
                        >
                          {`${payout.id.slice(0, 6)}...${payout.id.slice(-2)}`}
                          <span
                            className={`${copiedID === payout.id ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                          >
                            ID Copied
                          </span>
                        </td>

                        <td className="border-b border-slate-200 pl-3 py-3">
                          {payout.cluster ? (
                            capitalize(payout.cluster)
                          ) : (
                            <span className="text-gray-500">unavailable</span>
                          )}
                        </td>

                        <td className="border-b border-slate-200 pl-3 py-3">{payout.bill_code}</td>
                        <td className="border-b border-slate-200 pl-3 py-3">
                          {payout.institution.code}
                        </td>
                        <td className="border-b border-slate-200 pl-3 py-3">
                          {payout.account_number}
                        </td>

                        <td className="border-b border-slate-200 p-3 text-gray-500 tracking-normal">
                          {formatDate(payout?.createdAt)}
                        </td>

                        <td className="relative border-b border-slate-200 pl-3 py-3">
                          <button
                            type="button"
                            className="pt-0.5 pb-1 px-3 focus:outline-none text-white bg-red-500 rounded hover:bg-red-600 focus:z-10 focus:ring-4 focus:ring-red-200"
                            onClick={() => {
                              setSelectedID(payout.id);
                              setOpenModal(true);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pageCount > 1 && (
                <Pagination
                  currentPage={currentPage}
                  pageCount={pageCount}
                  total={totalPayoutMethods}
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

export default ListPayoutMethods;
