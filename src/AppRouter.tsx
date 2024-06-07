import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Profile from './pages/Profile';
import AirTime from './pages/AirTime/Index';

import Transaction from './pages/Transaction/Index';
import CreateTransaction from './pages/Transaction/CreateTransaction';
import TransactionList from './pages/Transaction/TransactionList';
import VerifyTransactionByID from './pages/Transaction/VerifyTransactionID';
import GenerateQRCode from './pages/GenerateQRCode';

import Transfer from './pages/BankTransfer/Index';
import TransferList from './pages/BankTransfer/TransferList';
import ExternalAccountLookup from './pages/BankTransfer/ExternalAccountLookup';
import TransferFee from './pages/BankTransfer/TransferFee';

import ScheduledPayment from './pages/ScheduledPayment/Index';
import CreateScheduled from './pages/ScheduledPayment/Create';
import ListScheduled from './pages/ScheduledPayment/List';

import RecurringContract from './pages/RecurringContract/Index';
import CreateContract from './pages/RecurringContract/CreateContract';
import ContractList from './pages/RecurringContract/ContractList';
import RequestPayment from './pages/RecurringContract/RequestPayment';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Layout from './components/layouts/Index';
import BulkImportReport from './components/BulkImportReport';
import BulkImportReportDetails from './components/BulkImportReportDetails';

const AppRouter = () => {
  return (
    <>
      <div className="lg:ml-[300px]">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="airtime" element={<AirTime />} />

              <Route path="transaction" element={<Transaction />} />
              <Route path="transaction/create" element={<CreateTransaction />} />
              <Route path="transaction/list" element={<TransactionList />} />
              <Route path="transaction/verify-id" element={<VerifyTransactionByID />} />

              <Route path="qr-code" element={<GenerateQRCode />} />

              <Route path="transfer" element={<Transfer />} />
              <Route path="transfer/list" element={<TransferList />} />
              <Route path="transfer/check-fee" element={<TransferFee />} />
              <Route path="transfer/account-lookup" element={<ExternalAccountLookup />} />

              <Route path="scheduled-payment" element={<ScheduledPayment />} />
              <Route path="scheduled-payment/create" element={<CreateScheduled />} />
              <Route path="scheduled-payment/list" element={<ListScheduled />} />

              <Route path="recurring-contract" element={<RecurringContract />} />
              <Route path="recurring-contract/create" element={<CreateContract />} />
              <Route path="recurring-contract/list" element={<ContractList />} />
              <Route path="recurring-contract/request-payment" element={<RequestPayment />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default AppRouter;
