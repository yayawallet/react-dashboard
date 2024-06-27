import { useState } from 'react';
import { Transfer } from '../../models';
import PageLoading from '../../components/ui/PageLoading';
import { useGetData } from '../../hooks/useSWR';

const TransferList = () => {
  const [copiedID, setCopiedID] = useState('');

  const copyTransferID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const { data: transferList } = useGetData('/transfer/list');

  return (
    <div className="table-container">
      {transferList?.length === 0 ? (
        <PageLoading />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-violet-500 text-gray-50">
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">ID</th>
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
                  Institution
                </th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Ref code
                </th>
              </tr>
            </thead>

            <tbody>
              {transferList?.map((t: Transfer) => (
                <tr
                  key={t?.id}
                  className="hover:bg-gray-100"
                  onClick={() => navigator.clipboard.writeText(t?.id)}
                >
                  <td
                    title={t?.id}
                    className="relative border-t border-b border-slate-200 p-3"
                    onClick={() => copyTransferID(t?.id)}
                  >
                    {`${t?.id.slice(0, 4)}...${t?.id.slice(-2)}`}
                    <span
                      className={`${copiedID === t?.id ? '' : 'hidden'} absolute -top-2 left-4 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg z-index`}
                    >
                      ID copied
                    </span>
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {t?.user.name.split(' ').slice(0, 2).join(' ')}
                    <br />
                    <span className="text-gray-500 text-xs block" style={{ marginTop: '-3px' }}>
                      {'@' + t?.user.account}
                    </span>
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {t?.user.account === t?.payment_method.account_number ? (
                      <span className="inline-block font-semibold text-green-600">&#43;&nbsp;</span>
                    ) : (
                      <span className="inline-block font-semibold text-red-600">&#8722;&nbsp;</span>
                    )}
                    {t?.amount}&nbsp;{t?.currency}
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {t?.payment_method.full_name.split(' ').slice(0, 2).join(' ')}
                    <br />
                    <span className="text-gray-500 text-xs block" style={{ marginTop: '-3px' }}>
                      {'@' + t?.payment_method.account_number}
                    </span>
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {t?.payment_method.institution.name}
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">{t?.ref_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransferList;
