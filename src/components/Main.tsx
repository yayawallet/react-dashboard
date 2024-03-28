import Profile from "./Profile";
import CreateTransaction from "./CreateTransaction";
import GenerateQRCode from "./GenerateQRCode";
import TransactionList from "./TransactionList";

const Main = () => {
  return (
    <div className="p-4">
      <TransactionList />
    </div>
  );
};

export default Main;
