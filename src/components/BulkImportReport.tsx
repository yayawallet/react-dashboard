import { useState } from 'react';
import { useGetData } from '../hooks/useSWR';
import { ReportType } from '../models';
import Loading from './ui/Loading';
import Error from './ui/Error';
import EmptyList from './ui/EmptyList';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/table_utils';
import RefreshButton from './ui/RefreshButton';

interface Props {
  documentType: string;
}

const BulkImportReport = ({ documentType }: Props) => {
  const [copiedID, setCopiedID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    isLoading,
    error,
    data: reportList,
    mutate,
  } = useGetData(`/report/list?document_type=${documentType}`);

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
          {reportList?.length === 0 ? (
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

              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="">
                    <tr className="bg-violet-500 text-gray-50">
                      <th className="text-left px-4 py-3 font-medium">ID</th>
                      <th className="text-left px-4 py-3 font-medium">Detail</th>
                      <th className="text-left px-4 py-3 font-medium">Succeed</th>
                      <th className="text-left px-4 py-3 font-medium">Failed</th>
                      <th className="text-left px-4 py-3 font-medium">Remark</th>
                      <th className="text-left px-4 py-3 font-medium">File Name</th>
                      <th className="text-left px-4 py-3 font-medium">Upload Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportList.map((list: ReportType) => (
                      <tr key={list.uuid} className="hover:bg-slate-100 text-nowrap">
                        <td
                          title={list.uuid}
                          className="relative border-b border-slate-200 p-3 cursor-pointer"
                          onClick={() => copyTransactionID(list.uuid)}
                        >
                          {`${list.uuid.slice(0, 6)}...${list.uuid.slice(-2)}`}
                          <span
                            className={`${copiedID === list.uuid ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                          >
                            ID Copied
                          </span>
                        </td>
                        <td className="relative border-b border-slate-200 p-3">
                          <button
                            type="button"
                            className="pt-0.5 pb-1 px-3 focus:outline-none bg-white rounded border border-violet-200 hover:bg-slate-200 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-slate-200"
                          >
                            <Link to={list.uuid}>Detail</Link>
                          </button>
                        </td>
                        <td className="text-green-600 font-semibold border-b border-slate-200 p-3 pl-6">
                          {list?.successful_count || '0'}
                        </td>
                        <td className="text-red-600 font-semibold border-b border-slate-200 p-3 pl-6">
                          {list?.failed_count || '0'}
                        </td>
                        <td className="border-b border-slate-200 p-3">{list?.remark}</td>
                        <td className="border-b border-slate-200 p-3">{list?.file_name}</td>
                        <td className="border-b border-slate-200 p-3">
                          {formatDate(list?.created_at)}
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

export default BulkImportReport;
