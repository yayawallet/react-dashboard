import axios from "axios";
import { useEffect, useState } from "react";

const TransactionList = () => {
  const [transactionList, setTransactionList] = useState([]);

  console.log(transactionList);

  useEffect(() => {
    axios
      .get("http://localhost:4000/getTransactionListByUser")
      .then((res) => setTransactionList(res.data.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr className="bg-indigo-500 text-gray-50">
            <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
              ID
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
            <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
              Date
            </th>
          </tr>
        </thead>

        <tbody>
          {transactionList.map((t) => (
            <tr key={t.id} className="hover:bg-gray-100">
              <td className="border-t border-b border-slate-200 p-3">{t.id}</td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.sender.name}
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.amount_with_currency}
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.receiver.name}
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.cause}
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.created_at_time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
