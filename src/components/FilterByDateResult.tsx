import { Cell, Pie, PieChart } from 'recharts';
import { formatDate } from '../utils/table_utils';
import { DotLoaderMedium } from './ui/DotLoader';

interface Props {
  filterValue: string;
  isLoading: boolean;
  totalIncoming: number;
  totalOutgoing: number;
  totalTransactions: number;
  customFilterStartTime: number;
  customFilterEndTime: number;
}

const FilterByDateResult = ({
  filterValue,
  isLoading,
  totalIncoming,
  totalOutgoing,
  totalTransactions,
  customFilterStartTime,
  customFilterEndTime,
}: Props) => {
  return (
    <div className={`${filterValue ? '' : 'hidden'}  px-2.5 mb-10 rounded-lg md:mx-4`}>
      <h3 className="text-xl font-semibold mb-2">
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
          <span className="text-gray-600 font-normal text-lg">{`${customFilterStartTime ? formatDate(new Date(customFilterStartTime * 1000)) : 'custom time'} - ${customFilterEndTime ? formatDate(new Date(customFilterEndTime * 1000)) : 'custom time'}`}</span>
        ) : (
          'All Time'
        )}
      </h3>

      <div className="flex flex-wrap items-center gap-6">
        <div className="text-gray-700 border-4 rounded-lg py-2 px-4 inline-block">
          <div>
            Total Incoming:{' '}
            <span className="text-gray-800 text-lg font-medium">
              {isLoading ? (
                '...'
              ) : totalIncoming ? (
                <span>
                  {totalIncoming} <span className="text-gray-500 text-base font-normal">ETB</span>
                </span>
              ) : (
                '--'
              )}
            </span>
          </div>
          <div>
            Total Outgoing:{' '}
            <span className="text-gray-800 text-lg font-medium">
              {isLoading ? (
                '...'
              ) : totalOutgoing ? (
                <span>
                  {totalOutgoing} <span className="text-gray-500 text-base font-normal">ETB</span>
                </span>
              ) : (
                '--'
              )}
            </span>
          </div>
          <div>
            Net:{' '}
            <span className="text-gray-800 text-lg font-medium">
              {isLoading ? (
                '...'
              ) : totalIncoming && totalOutgoing ? (
                <span>
                  {totalIncoming - totalOutgoing}{' '}
                  <span className="text-gray-500 text-base font-normal">ETB</span>
                </span>
              ) : (
                '--'
              )}
            </span>
          </div>
          <div>
            Total Number of Transactions:{' '}
            <span className="text-gray-800 text-xl font-semibold">
              {isLoading ? '...' : totalTransactions}
            </span>{' '}
            {totalTransactions > 1 ? 'transactions' : 'transaction'}
          </div>
        </div>

        <div className={`${totalIncoming && totalOutgoing ? '' : 'hidden'} overflow-x-auto`}>
          {isLoading ? (
            <div className="w-[80vw] max-w-[460px] h-[160px] flex self-center justify-center items-center">
              <DotLoaderMedium />
            </div>
          ) : (
            <PieChart width={460} height={160}>
              <Pie
                data={[
                  {
                    name: 'Total Incoming',
                    value: isLoading ? 0 : totalIncoming,
                  },
                  {
                    name: 'Total Outgoing',
                    value: isLoading ? 0 : totalOutgoing,
                  },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name, value }) =>
                  `${name} (${((value / (totalIncoming + totalOutgoing)) * 100).toFixed(0)}%)`
                }
                animationDuration={1000}
                fill="#8884d8"
              >
                <Cell fill={'#12abed'} />
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
