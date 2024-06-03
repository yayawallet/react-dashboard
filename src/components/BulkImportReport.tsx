import { useState } from 'react';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import { TRANSACTION_INVOICE_URL } from '../CONSTANTS';
import Loading from '../components/ui/LoadingSpinner';

const BulkImportReport = () => {
  const [copiedID, setCopiedID] = useState('');

  const bulkReportList = [
    {
      id: 'id0001',
      succeed: 24,
      failed: 2,
      remark: 'Electric Bill',
      fileName: 'Bill042024',
      uploadedAt: 'Jun 2, 2024 - 09:16:33',
    },
    {
      id: 'id0002',
      succeed: 4,
      failed: 0,
      remark: 'Staff Salary',
      fileName: 'salary112024',
      uploadedAt: 'Jun 5, 2024 - 09:16:33',
    },
  ];

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  return (
    <div className="-mx-4">
      <div className="ml-8">
        {/* <SearchBar onSearch={(query) => handleSearchTransaction(query)} /> */}
      </div>

      <div className="mt-2">
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

          {bulkReportList.length === 0 ? (
            <tbody className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
              <tr>
                <td>
                  <Loading />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {bulkReportList.map((t) => (
                <tr key={t?.id} className="hover:bg-gray-100 text-nowrap">
                  <td
                    title={t?.id}
                    className="relative border-t border-b border-slate-200 p-3"
                    onClick={() => copyTransactionID(t?.id)}
                  >
                    {`${t?.id.slice(0, 4)}...${t?.id.slice(-2)}`}
                    <span
                      className={`${copiedID === t?.id ? '' : 'hidden'} absolute -top-2 left-4 w-40 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                    >
                      ID Copied
                    </span>
                  </td>
                  <td className="relative border-t border-b border-slate-200 p-3">
                    <button
                      type="button"
                      className="py-0.5 px-3 text-sm text-violet-900 focus:outline-none bg-white rounded-lg border border-violet-200 hover:bg-violet-100 hover:text-violet-700 focus:z-10 focus:ring-4 focus:ring-violet-100"
                    >
                      <a href={`${TRANSACTION_INVOICE_URL}/${t.id}`} target="_blank">
                        detail
                      </a>
                    </button>
                  </td>
                  <td className="text-green-600 font-semibold border-t border-b border-slate-200 p-3 text-center">
                    {t?.succeed}
                  </td>
                  <td className="text-red-600 font-semibold border-t border-b border-slate-200 p-3 text-center">
                    {t?.failed}
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">{t?.remark}</td>
                  <td className="border-t border-b border-slate-200 p-3">{t?.fileName}</td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {`${new Date(Number(t?.uploadedAt) * 1000).toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* {pageCount > 1 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          isFetching={isFetching}
          onPageChange={handlePageChange}
        />
      )} */}
    </div>
  );
};

export default BulkImportReport;
