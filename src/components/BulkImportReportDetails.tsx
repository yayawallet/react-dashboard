import { useEffect, useState } from 'react';
import PageLoading from '../components/ui/PageLoading';
import useFetchData from '../hooks/useFetchData';
import NotFound from './NotFound';
import FetchingError from './layouts/FetchingError';

interface Props {
  id: string;
  documentType: string;
}

const BulkImportReportDetails = ({ id, documentType }: Props) => {
  const [column, setColumn] = useState<any[]>([]);

  const {
    isFetching,
    isError,
    isSuccess,
    data: reportDetails,
  } = useFetchData(['report', documentType], `/report/details/${id}?document_type=${documentType}`);

  useEffect(() => {
    if (reportDetails?.length < 1) return;

    setColumn(Object.keys(reportDetails[0]));
  }, [reportDetails]);

  return (
    <div className="page-container">
      {isFetching ? (
        <PageLoading />
      ) : isError ? (
        <FetchingError />
      ) : isSuccess && reportDetails.length === 0 ? (
        <NotFound />
      ) : (
        <>
          <div className="mt-2 overflow-auto">
            <table className="w-full">
              <thead className="">
                <tr className="bg-violet-500 text-gray-50">
                  {column?.map((col, index) => (
                    <th
                      key={index}
                      className="border-t border-b border-slate-100 text-left p-3 font-medium"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {reportDetails?.map((detail: any) => (
                  <tr key={detail.uuid} className="hover:bg-gray-100 text-nowrap">
                    {column?.map((col) => (
                      <td className="relative border-t border-b border-slate-200 p-3">
                        {detail[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default BulkImportReportDetails;
