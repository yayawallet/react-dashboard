import { useState } from 'react';
import { useGetData } from '../hooks/useSWR';
import Loading from './ui/Loading';
import Error from './ui/Error';
import EmptyList from './ui/EmptyList';
import { ReportDetailType } from '../models';
import { useParams } from 'react-router-dom';

const BulkImportReportDetails = () => {
  const [copiedID, setCopiedID] = useState('');
  const [, setCopiedErrorMsg] = useState('');
  const [selectedID, setSelectedID] = useState('');

  const { id } = useParams();

  const { error, isLoading, data: reportDetails } = useGetData(`/report/details/${id}}`);

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const copyErrorMessage = (err_msg: string, id: string) => {
    navigator.clipboard.writeText(err_msg);
    setCopiedErrorMsg(err_msg);
    setSelectedID(id);

    setTimeout(() => {
      setCopiedErrorMsg('');
      setSelectedID('');
    }, 1000);
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
            <h3 className="py-2 text-lg font-medium">Failed Records</h3>
            <ul>
              <li className="text-gray-600 font-semibold mr-4">
                Failed Count: {reportDetails.failed_count}
              </li>
            </ul>
          </div>

          {reportDetails?.length === 0 ? (
            <EmptyList />
          ) : (
            <div className="overflow-auto">
              <table className="w-full">
                <thead className="">
                  <tr className="bg-yaya-500 text-gray-50">
                    <th className="text-left px-4 py-2 font-medium">ID</th>
                    <th className="text-left px-4 py-2 font-medium">Row&nbsp;#</th>
                    <th className="text-left px-4 py-2 font-medium">Error Message</th>
                  </tr>
                </thead>

                <tbody>
                  {reportDetails.failed?.map((list: ReportDetailType) => (
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
                      <td className="border-b border-slate-200 p-3">{list.row_number}</td>
                      <td
                        title={list.error_message}
                        className="relative border-b border-slate-200 p-3 cursor-pointer"
                        onClick={() => copyErrorMessage(list.error_message, list.uuid)}
                      >
                        {list.error_message.substring(0, 80)}
                        {list.error_message.length > 80 ? '...' : ''}
                        <span
                          className={`${selectedID === list.uuid ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                        >
                          Error Message Copied
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkImportReportDetails;
