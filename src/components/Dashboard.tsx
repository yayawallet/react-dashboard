import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Profile from './pages/Profile';
import AirTime from './pages/AirTime/Index';
import CreateTransaction from './pages/CreateTransaction';
import GenerateQRCode from './pages/GenerateQRCode';
import TransactionList from './pages/TransactionList';
import TransferList from './pages/TransferList';
import Create from './pages/ScheduledPayment/Create';
import List from './pages/ScheduledPayment/List';
import CreateContract from './pages/RecurringContract/CreateContract';
import ContractList from './pages/RecurringContract/ContractList';
import RequestPayment from './pages/RecurringContract/RequestPayment';
import VerifyTransactionByID from './pages/VerifyTransactionID';
import TransferFee from './pages/TransferFee';
import ExternalAccountLookup from './pages/ExternalAccountLookup';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Layout from './Layout';

const Dashboard = () => {
  return (
    <>
      <div className="lg:ml-[300px]">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="airtime" element={<AirTime />} />
              <Route path="create-transaction" element={<CreateTransaction />} />
              <Route path="generate-qr-code" element={<GenerateQRCode />} />
              <Route path="transaction-list" element={<TransactionList />} />
              <Route path="transfer-list" element={<TransferList />} />
              <Route path="scheduled-payment/create" element={<Create />} />
              <Route path="scheduled-payment/list" element={<List />} />
              <Route path="recurring-contract/create" element={<CreateContract />} />
              <Route path="recurring-contract/list" element={<ContractList />} />
              <Route path="recurring-contract/request-payment" element={<RequestPayment />} />
              <Route path="verify-transaction-id" element={<VerifyTransactionByID />} />
              <Route path="check-transfer-fee" element={<TransferFee />} />
              <Route path="external-account-lookup" element={<ExternalAccountLookup />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default Dashboard;
