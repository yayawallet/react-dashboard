import { useState } from 'react';
import PageLoading from '../components/ui/PageLoading';
import useFetchData from '../hooks/useFetchData';
import NotFound from './NotFound';
import FetchingError from './layouts/FetchingError';
import { ReportType } from '../models';
import { authAxios } from '../api/axios';

interface Props {
  documentType: string;
}

const BulkImportReport = ({ documentType }: Props) => {
  const [copiedID, setCopiedID] = useState('');
  const [rs, setRS] = useState();

  console.log(rs ? rs : 'hi');
  // console.log(reportList);

  const {
    isFetching,
    isError,
    isSuccess,
    data: reportList,
  } = useFetchData(['report', documentType], `/report/list?document_type=${documentType}`);

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const fetchDetails = (id: string) => {
    authAxios.get(`/report/details/${id}}`).then((res) => setRS(res.data));
  };

  return (
    <div className="table-container">
      {isFetching ? (
        <PageLoading />
      ) : isError ? (
        <FetchingError />
      ) : isSuccess && reportList.length === 0 ? (
        <NotFound />
      ) : (
        <div className="mt-2 overflow-auto">
          <table className="w-full">
            <thead className="">
              <tr className="bg-violet-500 text-gray-50">
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">ID</th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Detail
                </th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Succeed
                </th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Failed
                </th>
                {/* <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Queued
                </th> */}
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Remark
                </th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  File Name
                </th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Upload Date
                </th>
              </tr>
            </thead>

            <tbody>
              {reportList.map((list: ReportType) => (
                <tr key={list.uuid} className="hover:bg-gray-100 text-nowrap">
                  <td
                    title={list.uuid}
                    className="relative border-t border-b border-slate-200 p-3"
                    onClick={() => copyTransactionID(list.uuid)}
                  >
                    {`${list.uuid.slice(0, 4)}...${list.uuid.slice(-2)}`}
                    <span
                      className={`${copiedID === list.uuid ? '' : 'hidden'} absolute -top-2 left-4 w-40 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                    >
                      ID copied
                    </span>
                  </td>
                  <td className="relative border-t border-b border-slate-200 p-3">
                    <button
                      type="button"
                      className="py-0.5 px-3 text-sm text-violet-900 focus:outline-none bg-white rounded-lg border border-violet-200 hover:bg-violet-100 hover:text-violet-700 focus:z-10 focus:ring-4 focus:ring-violet-100"
                      onClick={() => fetchDetails(list.uuid)}
                    >
                      Detail
                    </button>
                  </td>
                  <td className="text-green-600 font-semibold border-t border-b border-slate-200 p-3">
                    {list?.successful_count || '~'}
                  </td>
                  <td className="text-red-600 font-semibold border-t border-b border-slate-200 p-3">
                    {list?.failed_count || '~'}
                  </td>
                  {/* <td className="text-slate-600 font-semibold border-t border-b border-slate-200 p-3">
                    {list?.on_queue_count}
                  </td> */}
                  <td className="border-t border-b border-slate-200 p-3">{list?.remark}</td>
                  <td className="border-t border-b border-slate-200 p-3">{list?.file_name}</td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {`${new Date(list?.created_at).toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BulkImportReport;
