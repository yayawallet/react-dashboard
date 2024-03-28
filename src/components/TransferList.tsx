import axios from "axios";
import { useEffect, useState } from "react";

const TransferList = () => {
  const [transferList, setTransferList] = useState([]);

  console.log(transferList);

  useEffect(() => {
    axios
      .get("http://localhost:4000/getTransferList")
      .then((res) => setTransferList(res.data))
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
              Institution
            </th>
            <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
              Ref code
            </th>
          </tr>
        </thead>

        <tbody>
          {transferList.map((t) => (
            <tr key={t?.id} className="hover:bg-gray-100">
              <td className="border-t border-b border-slate-200 p-3">
                {`${t?.id.slice(0, 4)}...${t?.id.slice(-2)}`}
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.user.name.split(" ").slice(0, 2).join(" ")}
                <br />
                <span
                  className="text-gray-500 text-sm block"
                  style={{ marginTop: "-3px" }}
                >
                  {"@" + t?.user.account}
                </span>
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.amount}&nbsp;{t?.currency}
                <span className="inline-block ml-3 text-violet-900 text-xl">
                  {t?.user.account === t?.payment_method.account_number
                    ? "↙"
                    : "↗"}
                </span>
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.payment_method.full_name.split(" ").slice(0, 2).join(" ")}
                <br />
                <span
                  className="text-gray-500 text-sm block"
                  style={{ marginTop: "-3px" }}
                >
                  {"@" + t?.payment_method.account_number}
                </span>
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.payment_method.institution.name}
              </td>
              <td className="border-t border-b border-slate-200 p-3">
                {t?.ref_code}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransferList;
