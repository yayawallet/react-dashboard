import Profile from "./Profile";
import CreateTransaction from "./CreateTransaction";
import GenerateQRCode from "./GenerateQRCode";
import TransactionList from "./TransactionList";
import TransferList from "./TransferList";

const Main = () => {
  return (
    <div className="p-4">
      <TransferList />
    </div>
  );
};

export default Main;
