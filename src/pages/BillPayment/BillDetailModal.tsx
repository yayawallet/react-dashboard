import { BillListType } from '../../models';

interface Props {
  bill: BillListType;
}

const BillDetailModal = ({ bill }: Props) => {
  return (
    <div className="max-w-968 max-h-200 p-2 md:p-4 bg-white border-4 border-blue-600">
      <ul className="font-semibold">
        <li>{`Client Account: ${bill.client_yaya_account?.account}`}</li>
        <li>{bill.bill_id && `Bill ID: ${bill.bill_id}`}</li>
        <li>{bill.bill_code && `Bill Code: ${bill.bill_code}`}</li>
        <li>{bill.bill_season && `Bill Season: ${bill.bill_season}`}</li>
        <li>{bill.cluster && `Cluster: ${bill.cluster}`}</li>
        <li>{bill.description && `${bill.description}`}</li>
        <li>
          {bill.customer_yaya_account && `Customer Account: ${bill.customer_yaya_account?.account}`}
        </li>
        <li>{bill.customer_id && `Customer ID: ${bill.customer_id}`}</li>
        <li>{bill.phone && `Phone: ${bill.phone}`}</li>
        <li>{bill.due_at && `Due Date: ${bill.due_at}`}</li>
      </ul>
    </div>
  );
};

export default BillDetailModal;
