const BulkImportReportDetails = () => {
  const detailReport = [];

  return (
    <div>
      <h2 className="text-xl font-semibold p-2 mb-2">Report on Remark</h2>

      <ul className="space-y-2 text-gray-500 list-disc list-inside mb-10">
        <li>
          Number of succeed records:{' '}
          <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full">
            16
          </span>
        </li>
        <li>
          Number of failed records:{' '}
          <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full">
            2
          </span>
        </li>
      </ul>

      <div className="mt-2">
        <h3 className="text-lg font-semibold mb-2">Failed Records List</h3>

        <table className="w-full max-w-[1536px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-violet-500 text-gray-50">
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">ID</th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Invoice
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Sender
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Amount
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Receiver
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Cause
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">Date</th>
            </tr>
          </thead>

          {detailReport.length === 0 ? (
            <tbody className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
              <tr>
                <td>{/* <Loading /> */}</td>
              </tr>
            </tbody>
          ) : (
            <tbody></tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default BulkImportReportDetails;
