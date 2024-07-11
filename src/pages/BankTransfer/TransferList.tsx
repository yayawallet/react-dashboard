import { useState } from 'react';
import { Transfer } from '../../models';
import { useGetData } from '../../hooks/useSWR';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { capitalize } from '../../utils/table_utils';
import RefreshButton from '../../components/ui/RefreshButton';

const TransferList = () => {
  const [copiedID, setCopiedID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const copyTransferID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const { error, isLoading, data: transferList, mutate } = useGetData('/transfer/list');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
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
            <h3 className="py-2 text-lg font-medium">Transfer List</h3>

            <div onClick={handleRefresh}>
              <RefreshButton />
            </div>
          </div>

          {transferList.length === 0 ? (
            <EmptyList />
          ) : (
            <div className="relative">
              <div className={`${isRefreshing ? '' : 'hidden'}`}>
                <div
                  className="absolute z-10 bg-white rounded-full p-1.5"
                  style={{
                    top: '30vh',
                    left: '50%',
                    transform: 'translate(-50%)',
                    boxShadow: '0 0 5px #888',
                  }}
                >
                  <span
                    className="inline-block border-gray-400 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  ></span>
                </div>
                <div className="absolute z-20 h-full w-full"></div>
              </div>

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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransferList;
