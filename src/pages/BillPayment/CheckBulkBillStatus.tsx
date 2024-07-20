import { useState } from 'react';
import { useGetData } from '../../hooks/useSWR';
import { BulkBillStatus } from '../../models';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { capitalize, formatDate } from '../../utils/table_utils';
import { GoDotFill } from 'react-icons/go';
import RefreshButton from '../../components/ui/RefreshButton';

const CheckBulkBillStatus = () => {
  const [copiedID, setCopiedID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { isLoading, error, data: bulkImportList, mutate } = useGetData('/bulkimport/list');

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
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
      ) : isLoading ? (
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
                  <thead className="">
                    <tr className="bg-violet-500 text-gray-50">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckBulkBillStatus;
