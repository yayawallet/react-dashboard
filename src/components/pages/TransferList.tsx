import { useEffect, useState } from "react";
import axios from "axios";
import { Transfer } from "../../models";
import { BASE_URL } from "../../constants";

const TransferList = () => {
  const [transferList, setTransferList] = useState<Transfer[]>([]);
  const [copiedID, setCopiedID] = useState("");

  const copyTransferID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(""), 1000);
  };

  console.log(transferList);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/getTransferList`)
      .then((res) => setTransferList(res.data))
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
              Institution
            </th>
            <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
              Ref code
            </th>
          </tr>
        </thead>

        <tbody>
          {transferList.map((t) => (
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
                  className={`${copiedID === t?.id ? "" : "hidden"} absolute -top-2 left-4 w-24 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                >
                  Id copied
                </span>
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
                {t?.user.account === t?.payment_method.account_number ? (
                  <span className="inline-block ml-3  text-green-600">
                    &#43;&nbsp;
                  </span>
                ) : (
                  <span className="inline-block ml-3 text-red-600">
                    &#8722;&nbsp;
                  </span>
                )}
                {t?.amount}&nbsp;{t?.currency}
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