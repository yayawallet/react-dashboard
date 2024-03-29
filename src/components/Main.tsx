import Profile from "./Profile";
import CreateTransaction from "./CreateTransaction";
import GenerateQRCode from "./GenerateQRCode";
import TransactionList from "./TransactionList";
import TransferList from "./TransferList";
import VerifyTransactionByID from "./VerifyTransactionID";

const Main = () => {
  return (
    <div className="p-4">
      <VerifyTransactionByID />
    </div>
  );
};

export default Main;
