import { Cell, Pie, PieChart } from 'recharts';
import { formatDate } from '../utils/table_utils';
import '../components/ui/BlinkDotLoader.css';

interface Props {
  filterValue: string;
  isLoading: boolean;
  incomingSum: number;
  outgoingSum: number;
  totalTransactions: number;
  transactionLIstTotal: number;
  customFilterStartTime: number;
  customFilterEndTime: number;
}

const FilterByDateResult = ({
  filterValue,
  isLoading,
  incomingSum,
  outgoingSum,
  totalTransactions,
  transactionLIstTotal,
  customFilterStartTime,
  customFilterEndTime,
}: Props) => {
  return (
    <div className={`px-2.5 rounded-lg md:mx-3`}>
      <h3 className="text-xl font-semibold mb-2 text-center sm:text-start">
        Transactions with in{' '}
        {filterValue === '1D' ? (
          '1 Day'
        ) : filterValue === '3D' ? (
          '3 Days'
        ) : filterValue === '1W' ? (
          '1 Week'
        ) : filterValue === '1M' ? (
          '1 Month'
        ) : filterValue === 'custom' ? (
          <span className="text-gray-600 text-lg">{`${customFilterStartTime ? formatDate(new Date(customFilterStartTime * 1000)) : 'custom time'} - ${customFilterEndTime ? formatDate(new Date(customFilterEndTime * 1000)) : 'current'}`}</span>
        ) : (
          'All Time'
        )}
      </h3>

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
        <div className="text-gray-700 border-t rounded-lg p-5 inline-block bg-slate-50 shadow-md shadow-gray-400">
          <div className="text-[#008fd6]">
            Total Incoming:{' '}
            <span className="text-lg">
              {isLoading ? (
                '...'
              ) : typeof incomingSum === 'number' ? (
                <span>
                  {incomingSum.toLocaleString('en-US', { maximumFractionDigits: 2 })}{' '}
                  <span className="text-base">ETB</span>
                </span>
              ) : (
                '--'
              )}
            </span>
          </div>
          <div className="text-[#ff6242]">
            Total Outgoing:{' '}
            <span className="text-lg">
              {isLoading ? (
                '...'
              ) : typeof outgoingSum === 'number' ? (
                <span>
                  {outgoingSum.toLocaleString('en-US', { maximumFractionDigits: 2 })}{' '}
                  <span className="text-base">ETB</span>
                </span>
              ) : (
                '--'
              )}
            </span>
          </div>
          <div className="text-gray-800 pt-2">
            Net:{' '}
            <span className="text-lg">
              {isLoading ? (
                '...'
              ) : typeof incomingSum === 'number' && typeof outgoingSum === 'number' ? (
                <span>
                  {incomingSum - outgoingSum > 0 && <span>+</span>}
                  {(incomingSum - outgoingSum).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })}{' '}
                  <span className="text-base">ETB</span>
                </span>
              ) : (
                '--'
              )}
            </span>
          </div>
          <div className="text-gray-800">
            Number of Transactions:{' '}
            <span className="text-lg">{isLoading ? '...' : totalTransactions}</span>
            <span className="text-gray-600 ml-1">
              {filterValue === 'all'
                ? 'transactions'
                : `~ ${isLoading ? '...' : ((totalTransactions / transactionLIstTotal) * 100).toFixed(1)}% of the total`}
            </span>
          </div>
        </div>

        <div
          className={`${typeof incomingSum === 'number' && typeof outgoingSum === 'number' ? '' : 'hidden'} overflow-x-auto`}
        >
          {isLoading ? (
            <div className="w-[540px] p-10 flex justify-center ">
              <div className="loader"></div>
            </div>
          ) : (
            <PieChart width={540} height={220}>
              <Pie
                data={[
                  {
                    name: 'Total Incoming',
                    value: isLoading ? 0 : incomingSum,
                  },
                  {
                    name: 'Total Outgoing',
                    value: isLoading ? 0 : outgoingSum,
                  },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={70}
                label={({ name, value }) =>
                  `${name} (${((value / (incomingSum + outgoingSum)) * 100).toFixed(1)}%)`
                }
                animationDuration={1000}
                fill="#8884d8"
              >
                <Cell fill={'#008fd6'} />
                <Cell fill={'#ff6242'} />
              </Pie>
            </PieChart>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterByDateResult;
