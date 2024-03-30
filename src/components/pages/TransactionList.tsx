import axios from "axios";
import { useEffect, useState } from "react";

const TransactionList = () => {
  const [transactionList, setTransactionList] = useState([]);
  const [ownAccount, setOwnAccount] = useState("");
  const [copiedID, setCopiedID] = useState("");

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(""), 1000);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/getProfile`)
      .then((res) => setOwnAccount(res.data.account));

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/getTransactionListByUser`)
      .then((res) => setTransactionList(res.data.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container" style={{ overflowX: "auto" }}>
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
              <td
                title={t?.id}
                className="relative border-t border-b border-slate-200 p-3"
                onClick={() => copyTransactionID(t?.id)}
              >
                {`${t?.id.slice(0, 4)}...${t?.id.slice(-2)}`}
                <span
                  className={`${copiedID === t?.id ? "" : "hidden"} absolute -top-2 left-4 w-24 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                >
                  Id copied
                </span>
              </td>
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
                {ownAccount === t?.receiver.account ? (
                  <span className="inline-block ml-3  text-green-600">
                    &#43;&nbsp;
                  </span>
                ) : (
                  <span className="inline-block ml-3 text-red-600">
                    &#8722;&nbsp;
                  </span>
                )}
                {t?.amount_with_currency}
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
