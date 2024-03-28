import Profile from "./Profile";
import CreateTransaction from "./CreateTransaction";
import GenerateQRCode from "./GenerateQRCode";
import TransactionList from "./TransactionList";
import TransferList from "./TransferList";
import GetTransactionByID from "./GetTransactionID";

const Main = () => {
  return (
    <div className="p-4">
      <GetTransactionByID />
    </div>
  );
};

export default Main;
