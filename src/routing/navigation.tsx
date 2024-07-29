import { Navigate } from 'react-router-dom';

import AirTime from '../pages/AirTime/Index';

import Transaction from '../pages/Transaction/Index';
import CreateTransaction from '../pages/Transaction/CreateTransaction';
import TransactionList from '../pages/Transaction/TransactionList';
import VerifyTransactionByID from '../pages/Transaction/VerifyTransactionID';
import GenerateQRCode from '../pages/GenerateQRCode';

import BillPayment from '../pages/BillPayment/Index';
import CreateBill from '../pages/BillPayment/CreateBill';
import BillList from '../pages/BillPayment/ListBill';
import UpdateBill from '../pages/BillPayment/UpdateBill';
import CheckBulkBillStatus from '../pages/BillPayment/CheckBulkBillStatus';
import CreatePayoutMethod from '../pages/BillPayment/CreatePayoutMethod';
import ListPayoutMethods from '../pages/BillPayment/ListPayoutMethods';

import RegisterUsers from '../pages/RegisterUsers/Index';
import CreateLevelTwoAccount from '../pages/RegisterUsers/CreateLevelTwoAccount';
import CreateBussinessAccount from '../pages/RegisterUsers/CreateBusinessAccount';
import Invitation from '../pages/RegisterUsers/Invitation';
import NationalID from '../pages/RegisterUsers/NationalID';

import ScheduledPayment from '../pages/ScheduledPayment/Index';
import CreateScheduled from '../pages/ScheduledPayment/CreateScheduledPayment';
import ScheduledList from '../pages/ScheduledPayment/ScheduledList';
import ScheduleReport from '../pages/ScheduledPayment/ScheduledBulkReport';

import RecurringContract from '../pages/RecurringContract/Index';
import CreateContract from '../pages/RecurringContract/CreateContract';
import ContractList from '../pages/RecurringContract/ContractList';
import RequestPayment from '../pages/RecurringContract/RequestPayment';
import ContractReport from '../pages/RecurringContract/ContractReport';
import RequestPaymentReport from '../pages/RecurringContract/RequestPaymentReport';

import Transfer from '../pages/BankTransfer/Index';
import CreateTransfer from '../pages/BankTransfer/SendMoney';
import TransferList from '../pages/BankTransfer/TransferList';
import ExternalAccountLookup from '../pages/BankTransfer/ExternalAccountLookup';
import TransferFee from '../pages/BankTransfer/TransferFee';

import BulkImportReportDetails from '../components/BulkImportReportDetails';

import Support from '../pages/Support';
import Guide from '../pages/Guide';
import HelpCenter from '../pages/HelpCenter';
import AboutYaYa from '../pages/AboutYaYa';

// Non-menu navigations
import DefaultHeader from '../components/layouts/DefaultHeader';
import Layout from '../components/layouts/Index';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import AboutMe from '../pages/AboutMe';
import Login from '../pages/Authentication/Login';
import NotFound from '../pages/NotFound';

// Icons
import { MdSendToMobile } from 'react-icons/md';
import { BiTransferAlt } from 'react-icons/bi';
import { IoQrCode } from 'react-icons/io5';
import { RiCalendarScheduleLine } from 'react-icons/ri';
import { MdOutlinePayments } from 'react-icons/md';
import { RiBankFill } from 'react-icons/ri';
import { HiOutlineSupport } from 'react-icons/hi';
import { MdOutlineContactSupport } from 'react-icons/md';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { FaUserPlus } from 'react-icons/fa6';

export const sidebarNavs = [
  {
    title: 'Airtime/Package',
    path: 'airtime',
    icon: <MdSendToMobile />,
    element: <AirTime />,
    accessRoles: ['admin', 'agent', 'clerk'],
  },
  {
    title: 'Transaction',
    path: 'transaction',
    icon: <BiTransferAlt />,
    element: <Transaction />,
    accessRoles: ['admin', 'agent', 'clerk'],
    children: [
      {
        title: 'Create Transaction',
        path: 'create',
        element: <CreateTransaction />,
        accessRoles: ['admin', 'agent'],
      },
      {
        title: 'Transaction List',
        path: 'list',
        element: <TransactionList />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
      {
        title: 'Verify Transaction',
        path: 'verify-id',
        element: <VerifyTransactionByID />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
    ],
  },
  {
    title: 'Generate QR Code',
    path: 'qr-code',
    icon: <IoQrCode />,
    element: <GenerateQRCode />,
    accessRoles: ['admin', 'agent', 'clerk'],
  },
  {
    title: 'Bill Payment',
    path: 'bill',
    icon: <FaMoneyBillTrendUp />,
    element: <BillPayment />,
    accessRoles: ['admin', 'agent', 'clerk'],
    children: [
      {
        title: 'Create Bill',
        path: 'create',
        element: <CreateBill />,
        accessRoles: ['admin', 'agent'],
      },
      {
        title: 'List Bills',
        path: 'list',
        element: <BillList />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
      {
        title: 'Update Bill',
        path: 'update',
        element: <UpdateBill />,
        accessRoles: ['admin', 'agent'],
      },
      {
        title: 'Check Bulk Status',
        path: 'bulkimport-list',
        element: <CheckBulkBillStatus />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
      {
        title: 'Create Payout Method',
        path: 'create-payout-methods',
        element: <CreatePayoutMethod />,
        accessRoles: ['admin', 'agent'],
      },
      {
        title: 'List Payout Methods',
        path: 'payout-methods-list',
        element: <ListPayoutMethods />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
    ],
  },
  {
    title: 'Register Users',
    path: 'register-user',
    icon: <FaUserPlus />,
    element: <RegisterUsers />,
    accessRoles: ['agent'],
    children: [
      {
        title: 'Invitation',
        path: 'invitation',
        element: <Invitation />,
        accessRoles: ['agent'],
        children: [
          {
            title: 'Level Two',
            path: 'level-two',
            element: <CreateLevelTwoAccount />,
            accessRoles: ['agent'],
          },
          {
            title: 'Level Two',
            path: 'business',
            element: <CreateBussinessAccount />,
            accessRoles: ['agent'],
          },
        ],
      },
      {
        title: 'National ID',
        path: 'national-id',
        element: <NationalID />,
        accessRoles: ['agent'],
        children: [
          {
            title: 'Level Two',
            path: 'level-two',
            element: <CreateLevelTwoAccount />,
            accessRoles: ['agent'],
          },
          {
            title: 'Business',
            path: 'business',
            element: <CreateBussinessAccount />,
            accessRoles: ['agent'],
          },
        ],
      },
    ],
  },
  {
    title: 'Scheduled Payment',
    path: 'scheduled-payment',
    icon: <RiCalendarScheduleLine />,
    element: <ScheduledPayment />,
    accessRoles: ['admin', 'agent', 'clerk'],
    children: [
      {
        title: 'Create Schedule',
        path: 'create',
        element: <CreateScheduled />,
        accessRoles: ['admin', 'agent'],
      },
      {
        title: 'Scheduled List',
        path: 'list',
        element: <ScheduledList />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
      {
        title: 'Bulk Report',
        path: 'bulk-report',
        element: <ScheduleReport />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
    ],
  },
  {
    title: 'Recurring Contract',
    path: 'recurring-contract',
    icon: <MdOutlinePayments />,
    element: <RecurringContract />,
    accessRoles: ['admin', 'agent', 'clerk'],
    children: [
      {
        title: 'Create Contract',
        path: 'create',
        element: <CreateContract />,
        accessRoles: ['admin', 'agent'],
      },
      {
        title: 'Contract List',
        path: 'list',
        element: <ContractList />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
      {
        title: 'Contract Report',
        path: 'report',
        element: <ContractReport />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
      {
        title: 'Request Payment',
        path: 'request-payment',
        element: <RequestPayment />,
        accessRoles: ['admin', 'agent'],
      },
      {
        title: 'Request Payments Report',
        path: 'request-payment-report',
        element: <RequestPaymentReport />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
    ],
  },
  {
    title: 'Other Banks',
    path: 'transfer',
    icon: <RiBankFill />,
    element: <Transfer />,
    accessRoles: ['admin', 'agent', 'clerk'],
    children: [
      {
        title: 'Send Money',
        path: 'send',
        element: <CreateTransfer />,
        accessRoles: ['admin', 'agent'],
      },
      {
        title: 'Transfer List',
        path: 'list',
        element: <TransferList />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
      {
        title: 'Transfer Fee',
        path: 'transfer-fee',
        element: <TransferFee />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
      {
        title: 'Account Lookup',
        path: 'account-lookup',
        element: <ExternalAccountLookup />,
        accessRoles: ['admin', 'agent', 'clerk'],
      },
    ],
  },
  {
    title: 'User Guide',
    path: 'guide',
    element: <Guide />,
    icon: <MdOutlineContactSupport />,
    accessRoles: ['admin', 'agent', 'clerk'],
  },
  {
    title: 'Support',
    path: 'support',
    element: <Support />,
    icon: <HiOutlineSupport />,
    accessRoles: ['admin', 'agent', 'clerk'],
  },
];

export const privateNavs = [
  {
    path: '',
    element: <Layout />,
    children: [
      ...sidebarNavs,
      { path: 'scheduled-payment/bulk-report/:id', element: <BulkImportReportDetails /> },
      { path: 'recurring-contract/report/:id', element: <BulkImportReportDetails /> },
      {
        path: 'recurring-contract/request-payment/report/:id',
        element: <BulkImportReportDetails />,
      },
      { path: 'bill/update/:bill_id', element: <UpdateBill /> },
      { path: '', element: <Home /> },
      { path: 'profile', element: <Profile /> },
      { path: 'me', element: <AboutMe /> },
      { path: 'login', element: <Navigate to="/" replace={true} /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const publicNavs = [
  {
    path: '',
    element: <DefaultHeader />,
    children: [
      { path: '', element: <Navigate to="/login" replace={true} /> },
      { path: 'login', element: <Login /> },
      { path: 'help-center', element: <HelpCenter /> },
      { path: 'about-yaya', element: <AboutYaYa /> },
      { path: '*', element: <Navigate to="/login" replace={true} /> },
    ],
  },
];
