import { useState } from 'react';
import { Transfer } from '../../models';
import Loading from '../../components/ui/LoadingSpinner';
import useFetchData from '../../hooks/useFetchData';

const TransferList = () => {
  const [copiedID, setCopiedID] = useState('');

  const copyTransferID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const { data: transferList } = useFetchData(['transferList'], '/transfer/list');

  return (
    <div className="mt-2">
      <table className="w-full max-w-[1536px]">
        <thead className="sticky top-0 z-10">
          <tr className="bg-violet-500 text-gray-50">
            <th className="border-t border-b border-slate-100 text-left p-3 font-medium">ID</th>
            <th className="border-t border-b border-slate-100 text-left p-3 font-medium">Sender</th>
            <th className="border-t border-b border-slate-100 text-left p-3 font-medium">Amount</th>
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
        {transferList?.length === 0 ? (
          <tbody className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          </tbody>
        ) : (
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
                    className={`${copiedID === t?.id ? '' : 'hidden'} absolute -top-2 left-4 w-36 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                  >
                    Transfer ID Copied
                  </span>
                </td>
                <td className="border-t border-b border-slate-200 p-3">
                  {t?.user.name.split(' ').slice(0, 2).join(' ')}
                  <br />
                  <span className="text-gray-500 text-sm block" style={{ marginTop: '-3px' }}>
                    {'@' + t?.user.account}
                  </span>
                </td>
                <td className="border-t border-b border-slate-200 p-3">
                  {t?.user.account === t?.payment_method.account_number ? (
                    <span className="inline-block ml-3 font-semibold text-green-600">
                      &#43;&nbsp;
                    </span>
                  ) : (
                    <span className="inline-block ml-3 font-semibold text-red-600">
                      &#8722;&nbsp;
                    </span>
                  )}
                  {t?.amount}&nbsp;{t?.currency}
                </td>
                <td className="border-t border-b border-slate-200 p-3">
                  {t?.payment_method.full_name.split(' ').slice(0, 2).join(' ')}
                  <br />
                  <span className="text-gray-500 text-sm block" style={{ marginTop: '-3px' }}>
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
        )}
      </table>
    </div>
  );
};

export default TransferList;
