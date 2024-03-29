import Profile from "./Profile";
import CreateTransaction from "./CreateTransaction";
import GenerateQRCode from "./GenerateQRCode";
import TransactionList from "./TransactionList";
import TransferList from "./TransferList";
import VerifyTransactionByID from "./VerifyTransactionID";
import Transfer from "./TransferFee";

const Main = () => {
  return (
    <div className="p-4">
      <Transfer />
    </div>
  );
};

export default Main;
