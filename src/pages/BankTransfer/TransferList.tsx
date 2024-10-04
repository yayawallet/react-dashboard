import { useState } from 'react';
import { Transfer } from '../../models';
import { useGetData } from '../../hooks/useSWR';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { capitalize, formatDate } from '../../utils/table_utils';
import RefreshButton from '../../components/ui/RefreshButton';
import Pagination from '../../components/Pagination';
import RefreshComponent from '../../components/ui/RefreshComponent';
import { IoIosArrowForward, IoIosArrowUp } from 'react-icons/io';

const TransferList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedID, setCopiedID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openCustomFilter, setOpenCustomFilter] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [filterStartTime, setFilterStartTime] = useState(0);
  const [filterEndTime, setFilterEndTime] = useState(0);

  const copyTransferID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const {
    error,
    isLoading,
    mutate,
    isValidating,
    data: { data: transferList, lastPage: pageCount, total: totalPayoutMethods, perPage } = {},
  } = useGetData(
    `/transfer/list?p=${currentPage}${filterStartTime !== 0 ? `&start=${filterStartTime}` : ''}${filterEndTime !== 0 ? `&end=${filterEndTime}` : ''}`
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  const getCurrentTime = async () => {
    // const { data: { time: currentTime } = {} } = await axios.get(
    //   `${import.meta.env.VITE_GET_TIME_URL}`
    // );

    const currentTime = new Date().getTime();

    return currentTime;
  };

  const handleFilterByDate = async (value: string) => {
    setFilterValue(value);

    // Reset custom filter values
    setFilterStartTime(0);
    setFilterEndTime(0);
    if (value !== 'custom') setOpenCustomFilter(false);

    if (!value) return; // If no filter is selected, clear filter
    if (value === 'custom') return; // If custom filter is selected, the user selecst the date range

    if (transferList && transferList.length === 0) return; // If there is no data, do not filter

    if (value === '1D') {
      const currentTime = await getCurrentTime();
      const oneDayAgo = new Date(currentTime / 1000 - 24 * 60 * 60);

      setFilterStartTime(oneDayAgo.getTime());
      return;
    }

    if (value === '3D') {
      const currentTime = await getCurrentTime();
      const threeDaysAgo = new Date(currentTime / 1000 - 3 * 24 * 60 * 60);

      setFilterStartTime(threeDaysAgo.getTime());
      return;
    }

    if (value === '1W') {
      const currentTime = await getCurrentTime();
      const oneWeekAgo = new Date(currentTime / 1000 - 7 * 24 * 60 * 60);

      setFilterEndTime(oneWeekAgo.getTime());
      return;
    }

    if (value === '1M') {
      const currentTime = await getCurrentTime();
      const oneMonthAgo = new Date(currentTime / 1000 - 30 * 24 * 60 * 60);

      setFilterStartTime(oneMonthAgo.getTime());
      return;
    }
  };

  return (
    <div className="table-container">
      {error ? (
        <Error />
      ) : (
        <div className="border border-slate-200 rounded-xl">
          <div className="">
            <div className="flex flex-wrap justify-between items-center m-3">
              <h3 className="py-2 text-lg font-medium">Transfer List</h3>

              <div onClick={handleRefresh}>
                <RefreshButton />
              </div>
            </div>

            <div className="flex flex-wrap items-end mb-8 ml-4 gap-8 mt-6">
              <div className="flex flex-col items-center gap-2">
                <div className="text-gray-500 self-start">Filter by date</div>
                <div className="inline-flex px-4 py-1 gap-1 bg-gray-100 text-gray-800 text-[15px] rounded">
                  <button
                    className={`${filterValue === '1D' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
                    onClick={() => handleFilterByDate('1D')}
                    disabled={transferList && transferList.length === 0}
                  >
                    1D
                  </button>
                  <button
                    className={`${filterValue === '3D' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
                    onClick={() => handleFilterByDate('3D')}
                    disabled={transferList && transferList.length === 0}
                  >
                    3D
                  </button>
                  <button
                    className={`${filterValue === '1W' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
                    onClick={() => handleFilterByDate('1W')}
                    disabled={transferList && transferList.length === 0}
                  >
                    1W
                  </button>
                  <button
                    className={`${filterValue === '1M' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
                    onClick={() => handleFilterByDate('1M')}
                    disabled={transferList && transferList.length === 0}
                  >
                    1M
                  </button>
                  <button
                    className={`${filterValue === '' ? 'bg-yayaBrand-600 text-white' : ''} px-2 py-1 rounded cursor-pointer`}
                    onClick={() => handleFilterByDate('')}
                    disabled={transferList && transferList.length === 0}
                  >
                    All
                  </button>
                </div>
              </div>

              <div className="flex items-end gap-3">
                <button
                  className={`${filterValue === 'custom' ? 'bg-yayaBrand-600 text-white' : 'text-gray-800 bg-gray-100'} flex items-center gap-1 cursor-pointer px-2.5 pt-1.5 pb-2 rounded`}
                  onClick={() => {
                    setOpenCustomFilter(!openCustomFilter);
                    handleFilterByDate('custom');
                  }}
                  disabled={transferList && transferList.length === 0}
                >
                  <span>Custom</span>
                  <span className="mt-1">
                    {openCustomFilter ? <IoIosArrowUp /> : <IoIosArrowForward />}
                  </span>
                </button>

                <div className={`${openCustomFilter ? '' : 'hidden'} flex items-center gap-4`}>
                  <div className="">
                    <label htmlFor="start" className="block mb-1 ml-2 text-sm font-medium">
                      From
                    </label>
                    <input
                      type="datetime-local"
                      id="start"
                      max={new Date().toISOString().replace(/:\d{2}\.\d{3}Z$/, '')}
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full px-2.5 py-1.5"
                      onChange={(e) =>
                        setFilterStartTime(new Date(e.target.value).getTime() / 1000)
                      }
                    />
                  </div>

                  <div className="">
                    <label htmlFor="end" className="block mb-1 ml-2 text-sm font-medium">
                      To
                    </label>
                    <input
                      type="datetime-local"
                      id="end"
                      max={new Date().toISOString().replace(/:\d{2}\.\d{3}Z$/, '')}
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full px-2.5 py-1.5"
                      onChange={(e) => setFilterEndTime(new Date(e.target.value).getTime() / 1000)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading && currentPage === 1 ? (
            <Loading />
          ) : transferList.length === 0 ? (
            <EmptyList />
          ) : (
            <div className="relative">
              <RefreshComponent isRefreshing={isRefreshing || isValidating} />

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">ID</th>
                      <th className="text-left px-4 py-3 font-medium">Sender</th>
                      <th className="text-left px-4 py-3 font-medium">Amount</th>
                      <th className="text-left px-4 py-3 font-medium">Receiver</th>
                      <th className="text-left px-4 py-3 font-medium">Institution</th>
                      <th className="text-left px-4 py-3 font-medium">Ref code</th>
                      <th className="text-left px-4 py-3 font-medium">Created At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transferList?.map((t: Transfer) => (
                      <tr
                        key={t?.id}
                        className="hover:bg-slate-100"
                        onClick={() => navigator.clipboard.writeText(t?.id)}
                      >
                        <td
                          title={t?.id}
                          className="relative border-b border-slate-200 p-3  cursor-pointer"
                          onClick={() => copyTransferID(t?.id)}
                        >
                          {`${t?.id.slice(0, 6)}...${t?.id.slice(-2)}`}
                          <span
                            className={`${copiedID === t?.id ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                          >
                            ID Copied
                          </span>
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          {t?.user.name.split(' ').slice(0, 2).join(' ')}
                          <br />
                          <span
                            className="text-gray-500 text-xs block"
                            style={{ marginTop: '-3px' }}
                          >
                            {'@' + t?.user.account}
                          </span>
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          {t?.user.account === t?.payment_method.account_number ? (
                            <span className="inline-block font-semibold text-green-600">
                              &#43;&nbsp;
                            </span>
                          ) : (
                            <span className="inline-block font-semibold text-red-600">
                              &#8722;&nbsp;
                            </span>
                          )}
                          {t?.amount.toFixed(2)}&nbsp;
                          <span className="text-gray-500 text-sm">{t?.currency}</span>
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          {capitalize(t?.payment_method.full_name).split(' ').slice(0, 2).join(' ')}
                          <br />
                          <span
                            className="text-gray-500 text-xs block"
                            style={{ marginTop: '-3px' }}
                          >
                            {'@' + t?.payment_method.account_number}
                          </span>
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          {t?.payment_method.institution.name}
                        </td>
                        <td className="border-b border-slate-200 p-3">{t?.ref_code}</td>
                        <td className="border-b border-slate-200 p-3 text-gray-500 tracking-normal">
                          {formatDate(t?.created_at_time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pageCount > 1 && (
                <Pagination
                  currentPage={currentPage}
                  pageCount={pageCount}
                  total={totalPayoutMethods}
                  perPage={perPage}
                  isLoading={isLoading}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransferList;
