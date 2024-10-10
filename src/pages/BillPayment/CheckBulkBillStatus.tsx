import { useState } from 'react';
import { useGetData } from '../../hooks/useSWR';
import { BulkBillStatus } from '../../models';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { capitalize, formatDate } from '../../utils/table_utils';
import { GoDotFill } from 'react-icons/go';
import RefreshButton from '../../components/ui/RefreshButton';
import Pagination from '../../components/Pagination';
import RefreshComponent from '../../components/ui/RefreshComponent';

const CheckBulkBillStatus = () => {
  const [copiedID, setCopiedID] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    isLoading,
    error,
    data: { data: bulkImportList, lastPage: pageCount, total: totalList, perPage } = {},
    mutate,
    isValidating,
  } = useGetData(`/bulkimport/list?p=${currentPage}`);

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          <div className="flex flex-wrap justify-between items-center m-3">
            <h3 className="py-2 text-lg font-medium">Bulk Report</h3>

            <div onClick={handleRefresh}>
              <RefreshButton />
            </div>
          </div>
          {bulkImportList?.length === 0 ? (
            <EmptyList />
          ) : (
            <div className="relative">
              <RefreshComponent isRefreshing={isRefreshing || isValidating} />

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="">
                    <tr className="bg-yaya-500 text-gray-50">
                      <th className="text-left px-4 py-3 font-medium">ID</th>
                      <th className="text-left px-4 py-3 font-medium text-sm">
                        Submited
                        <br />
                        records
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-sm">
                        Succeed
                        <br />
                        records
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-sm">
                        Failed
                        <br />
                        records
                      </th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Created At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bulkImportList?.map((list: BulkBillStatus) => (
                      <tr key={list.id} className="hover:bg-slate-100 text-nowrap">
                        <td
                          title={list.id}
                          className="relative border-b border-slate-200 p-3 cursor-pointer"
                          onClick={() => copyTransactionID(list.id)}
                        >
                          {`${list.id.slice(0, 16)}...${list.id.slice(-4)}`}
                          <span
                            className={`${copiedID === list.id ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                          >
                            ID Copied
                          </span>
                        </td>

                        <td className="text-gray-600 font-semibold border-b border-slate-200 p-3 pl-6">
                          {list.submitted_records}
                        </td>
                        <td className="text-green-600 font-semibold border-b border-slate-200 p-3 pl-6">
                          {list.imported_records}
                        </td>
                        <td className="text-red-600 font-semibold border-b border-slate-200 p-3 pl-6">
                          {list.failed_records}
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          <span
                            className={`inline-block align-middle pb-0.5 pr-1 text-[16px] ${list.status === 'DONE' ? 'text-green-500' : list.status === 'FAILED' ? 'text-red-600' : list.status === 'PENDING' ? 'text-orange-400' : 'text-gray-500'}`}
                          >
                            <GoDotFill />
                          </span>
                          {capitalize(list.status)}
                        </td>
                        <td className="border-b border-slate-200 p-3 text-gray-500 tracking-normal">
                          {formatDate(list.createdAt)}
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
                  total={totalList}
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

export default CheckBulkBillStatus;
