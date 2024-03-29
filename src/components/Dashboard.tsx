import { BrowserRouter, Routes, Route } from "react-router-dom";

import Profile from "./pages/Profile";
import CreateTransaction from "./pages/CreateTransaction";
import GenerateQRCode from "./pages/GenerateQRCode";
import TransactionList from "./pages/TransactionList";
import TransferList from "./pages/TransferList";
import VerifyTransactionByID from "./pages/VerifyTransactionID";
import TransferFee from "./pages/TransferFee";
import ExternalAccountLookup from "./pages/ExternalAccountLookup";
import Layout from "./Layout";

const Dashboard = () => {
  return (
    <>
      <div className="sm:ml-64">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index path="profile" element={<Profile />} />
              <Route
                path="create-transaction"
                element={<CreateTransaction />}
              />
              <Route path="generate-qr-code" element={<GenerateQRCode />} />
              <Route path="transaction-list" element={<TransactionList />} />
              <Route path="transfer-list" element={<TransferList />} />
              <Route
                path="verify-transaction-id"
                element={<VerifyTransactionByID />}
              />
              <Route path="check-transfer-fee" element={<TransferFee />} />
              <Route
                path="external-account-lookup"
                element={<ExternalAccountLookup />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default Dashboard;
