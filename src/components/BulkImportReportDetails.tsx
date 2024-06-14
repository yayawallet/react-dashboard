import PageLoading from '../components/ui/PageLoading';
import useFetchData from '../hooks/useFetchData';
import NotFound from './NotFound';
import FetchingError from './layouts/FetchingError';

interface Props {
  id: string;
  documentType: string;
}

// type ReportSchedule = {
//   uuid: string;
//   succeed_count: number;
//   failed_count: number;
//   file_name: string;
//   remark: string;
//   created_at: Date;
// };

const BulkImportReportDetails = ({ id, documentType }: Props) => {
  const {
    isFetching,
    isError,
    isSuccess,
    data: reportDetails,
  } = useFetchData(['report', documentType], `/report/details/${id}?document_type=${documentType}`);

  console.log(reportDetails);

  return (
    <div className="table-container">
      {isFetching ? (
        <PageLoading />
      ) : isError ? (
        <FetchingError />
      ) : isSuccess && reportDetails.length === 0 ? (
        <NotFound />
      ) : (
        <>
          <div className="page-container">
            <h2 className="text-xl font-semibold p-2 mb-2">Report on Remark</h2>
            <ul className="space-y-2 text-gray-500 list-disc list-inside mb-10">
              <li>
                Number of succeed records:{' '}
                <span className="bg-green-100 text-green-600 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full">
                  {reportDetails.uploaded_count}
                </span>
              </li>
              <li>
                Number of failed records:{' '}
                <span className="bg-red-100 text-red-600 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full">
                  {reportDetails.failed_count}
                </span>
              </li>
              <li>
                On queue records:{' '}
                <span className="bg-red-100 text-gray-600 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full">
                  {reportDetails.on_queue_count}
                </span>
              </li>
              <li>
                Total records:{' '}
                <span className="bg-red-100 text-blue-600 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full">
                  {reportDetails.total_count}
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-2 overflow-auto">
            {/* <table className="w-full">
              <thead className="">
                <tr className="bg-violet-500 text-gray-50">
                  <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                    ID
                  </th>
                  <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                    Detail
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
                {reportDetails.map((list) => (
                  <tr key={list.uuid} className="hover:bg-gray-100 text-nowrap">
                    <td
                      title={list.uuid}
                      className="relative border-t border-b border-slate-200 p-3"
                      onClick={() => copyTransactionID(list.uuid)}
                    >
                      {`${list.id.slice(0, 4)}...${list.id.slice(-2)}`}
                      <span
                        className={`${copiedID === list.id ? '' : 'hidden'} absolute -top-2 left-4 w-40 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                      >
                        ID copied
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
            </table> */}
          </div>
        </>
      )}
    </div>
  );
};

export default BulkImportReportDetails;
