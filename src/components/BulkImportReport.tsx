import { useEffect, useState } from 'react';
import { TRANSACTION_INVOICE_URL } from '../CONSTANTS';
import PageLoading from '../components/ui/PageLoading';
import axios from 'axios';

interface Props {
  documentType: string;
}

type ReportSchedule = {
  uuid: string;
  succeed_count: number;
  failed_count: number;
  file_name: string;
  remark: string;
  created_at: Date;
};

const BulkImportReport = ({ documentType }: Props) => {
  const [copiedID, setCopiedID] = useState('');
  const [reportList, setReportList] = useState<ReportSchedule[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/report/list?document_type=' + documentType)
      .then((res) => setReportList(res.data));
  }, []);

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  return (
    <div className="table-container">
      <div className="ml-8"></div>

      <div className="mt-2">
        {reportList.length <= 0 ? (
          <PageLoading />
        ) : (
          <table className="w-full max-w-[1536px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-violet-500 text-gray-50">
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">ID</th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Report
                </th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Succeed
                </th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Failed
                </th>
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
              {reportList.map((list) => (
                <tr key={list?.uuid} className="hover:bg-gray-100 text-nowrap">
                  <td
                    title={list?.uuid}
                    className="relative border-t border-b border-slate-200 p-3"
                    onClick={() => copyTransactionID(list?.uuid)}
                  >
                    {`${list?.uuid.slice(0, 4)}...${list?.uuid.slice(-2)}`}
                    <span
                      className={`${copiedID === list?.uuid ? '' : 'hidden'} absolute -top-2 left-4 w-40 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                    >
                      ID Copied
                    </span>
                  </td>
                  <td className="relative border-t border-b border-slate-200 p-3">
                    <button
                      type="button"
                      className="py-0.5 px-3 text-sm text-violet-900 focus:outline-none bg-white rounded-lg border border-violet-200 hover:bg-violet-100 hover:text-violet-700 focus:z-10 focus:ring-4 focus:ring-violet-100"
                    >
                      <a href={`${TRANSACTION_INVOICE_URL}/${list?.uuid}`} target="_blank">
                        Detail
                      </a>
                    </button>
                  </td>
                  <td className="text-green-600 font-semibold border-t border-b border-slate-200 p-3">
                    {list?.succeed_count || 92}
                  </td>
                  <td className="text-red-600 font-semibold border-t border-b border-slate-200 p-3">
                    {list?.failed_count || 8}
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">{list?.remark}</td>
                  <td className="border-t border-b border-slate-200 p-3">{list?.file_name}</td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {`${new Date(list?.created_at).toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BulkImportReport;
