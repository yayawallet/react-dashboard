import { useState } from 'react';
import { useGetData } from '../hooks/useSWR';
import { ReportType } from '../models';
import { authAxios } from '../api/axios';
import DataFetching from './ui/DataFetching';
import FetchError from './ui/FetchError';
import NoItems from './ui/NoItems';

interface Props {
  documentType: string;
}

const BulkImportReport = ({ documentType }: Props) => {
  const [copiedID, setCopiedID] = useState('');
  const [rs, setRS] = useState();

  console.log(rs ? rs : 'hi');
  // console.log(reportList);

  const {
    isLoading,
    error,
    data: reportList,
  } = useGetData(`/report/list?document_type=${documentType}`);

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
      {error ? (
        <FetchError />
      ) : isLoading ? (
        <DataFetching />
      ) : reportList?.length === 0 ? (
        <NoItems />
      ) : (
        <div className="border border-slate-200 rounded-xl">
          <div className="flex flex-wrap justify-between items-center m-3">
            <h3 className="py-2 text-lg font-medium">Bulk Report</h3>
          </div>
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="">
                <tr className="bg-violet-500 text-gray-50">
                  <th className="text-left px-4 py-2 font-medium">ID</th>
                  <th className="text-left px-4 py-2 font-medium">Detail</th>
                  <th className="text-left px-4 py-2 font-medium">Succeed</th>
                  <th className="text-left px-4 py-2 font-medium">Failed</th>
                  <th className="text-left px-4 py-2 font-medium">Remark</th>
                  <th className="text-left px-4 py-2 font-medium">File Name</th>
                  <th className="text-left px-4 py-2 font-medium">Upload Date</th>
                </tr>
              </thead>

              <tbody>
                {reportList.map((list: ReportType) => (
                  <tr key={list.uuid} className="hover:bg-gray-100 text-nowrap">
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
                        className="py-0.5 px-3 text-sm text-violet-900 focus:outline-none bg-white rounded-lg border border-violet-200 hover:bg-violet-100 hover:text-violet-700 focus:z-10 focus:ring-4 focus:ring-violet-100"
                        onClick={() => fetchDetails(list.uuid)}
                      >
                        Detail
                      </button>
                    </td>
                    <td className="text-green-600 font-semibold border-b border-slate-200 p-3">
                      {list?.successful_count || '~'}
                    </td>
                    <td className="text-red-600 font-semibold border-b border-slate-200 p-3">
                      {list?.failed_count || '~'}
                    </td>
                    <td className="border-b border-slate-200 p-3">{list?.remark}</td>
                    <td className="border-b border-slate-200 p-3">{list?.file_name}</td>
                    <td className="border-b border-slate-200 p-3">
                      {`${new Date(list?.created_at).toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkImportReport;
