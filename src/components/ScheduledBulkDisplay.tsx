import { useLocation } from 'react-router-dom';
import EmptyList from './ui/EmptyList';
import { formatDate } from '../utils/table_utils';
import BackButton from './ui/BackButton';

interface JsonObject {
  name: string;
  account_number: string;
  amount: number;
  reason: string;
  recurring: string;
  start_at: Date;
}

const ScheduledBulkDisplay = () => {
  const location = useLocation();
  const { data: jsonData, remark } = location.state || {};

  return (
    <>
      <div className="table-container">
        {!jsonData?.length ? (
          <EmptyList />
        ) : (
          <div className="border border-slate-200 rounded-xl">
            <div className="flex flex-wrap justify-between items-center m-3">
              <h3 className="py-2 text-lg font-medium">Scheduled Payment - {remark}</h3>

              <BackButton />
            </div>

            {jsonData.length === 0 ? (
              <EmptyList />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">No.</th>
                      <th className="text-left px-4 py-3 font-medium">Receiver</th>
                      <th className="text-left px-4 py-3 font-medium">Account #</th>
                      <th className="text-left px-4 py-3 font-medium">Amount</th>
                      <th className="text-left px-4 py-3 font-medium">Reason</th>
                      <th className="text-left px-4 py-3 font-medium">Recurring Type</th>
                      <th className="text-left px-4 py-3 font-medium">Start At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jsonData?.map((item: JsonObject, index: number) => (
                      <tr key={index} className="hover:bg-slate-100">
                        <td className="border-b border-slate-200 p-3">{index + 1}</td>
                        <td className="border-b border-slate-200 p-3">{item?.name}</td>
                        <td className="border-b border-slate-200 p-3">{item?.account_number}</td>
                        <td className="border-b border-slate-200 p-3">{item?.amount}</td>
                        <td className="border-b border-slate-200 p-3">{item?.reason}</td>
                        <td className="border-b border-slate-200 p-3">{item?.recurring}</td>
                        <td className="border-b border-slate-200 p-3 text-gray-500 tracking-normal">
                          {formatDate(item?.start_at)}
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
    </>
  );
};

export default ScheduledBulkDisplay;
