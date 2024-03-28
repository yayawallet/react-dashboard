import axios from "axios";
import { useEffect, useState } from "react";

const TransactionList = () => {
  const [transactionList, setTransactionList] = useState([]);
  const [ownAccount, setOwnAccount] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/getProfile")
      .then((res) => setOwnAccount(res.data.account));

    axios
      .get("http://localhost:4000/getTransactionListByUser")
      .then((res) => setTransactionList(res.data.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ minWidth: "960px" }}>
        <thead>
          <tr className="bg-violet-500 text-gray-50">
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
            <tr key={t?.id} className="hover:bg-gray-100">
              <td className="border-t border-b border-slate-200 p-3">{`${t?.id.slice(0, 4)}...${t?.id.slice(-2)}`}</td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.sender.name.split(" ").slice(0, 2).join(" ")}
                <br />
                <span
                  className="text-gray-500 text-sm block"
                  style={{ marginTop: "-3px" }}
                >
                  {"@" + t?.sender.account}
                </span>
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.amount_with_currency}
                {ownAccount === t?.receiver.account ? (
                  <span className="inline-block ml-3  text-green-600 text-xl">
                    &#8601;
                  </span>
                ) : (
                  <span className="inline-block ml-3 text-red-600 text-xl">
                    &#8599;
                  </span>
                )}
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.receiver.name.split(" ").slice(0, 2).join(" ")}
                <br />
                <span
                  className="text-gray-500 text-sm block"
                  style={{ marginTop: "-3px" }}
                >
                  {"@" + t?.receiver.account}
                </span>
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {`${t?.cause.slice(0, 16)}${t?.cause.charAt(17) ? "..." : ""}`}
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {`${new Date(t?.created_at_time)
                  .toISOString()
                  .replace("T", " ")
                  .replace("Z", "")
                  .replace(/\.\d+$/, "")}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
