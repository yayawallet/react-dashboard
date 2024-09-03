import { Navigate } from 'react-router-dom';

import AirTime from '../pages/AirTime/Index';

import Transaction from '../pages/Transaction/Index';
import CreateTransaction from '../pages/Transaction/CreateTransaction';
import TransactionList from '../pages/Transaction/TransactionList';
import VerifyTransactionByID from '../pages/Transaction/VerifyTransactionID';
import GenerateQRCode from '../pages/GenerateQRCode';
import ApprovalRequestsList from '../pages/Transaction/ApprovalRequestsList';

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
import ScheduleApprovalRequestsList from '../pages/ScheduledPayment/ApprovalRequestsList';

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
import BankTransferApprovalRequestsList from '../pages/BankTransfer/ApprovalRequestsList';

import BulkImportReportDetails from '../components/BulkImportReportDetails';

import UserAccount from '../pages/UserSettings/UserAccount';
import ChangePassword from '../pages/UserSettings/ChangePassword';

import Support from '../pages/Support';
import Guide from '../pages/Guide';
import HelpCenter from '../pages/HelpCenter';
import AboutYaYa from '../pages/AboutYaYa';

// Non-menu navigations
import DefaultHeader from '../components/layouts/DefaultHeader';
import Layout from '../components/layouts/Index';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
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
    title: 'Transaction',
    path: 'transaction',
    icon: <BiTransferAlt />,
    element: <Transaction />,
    accessRoles: ['accountant', 'approver', 'clerk'],
    children: [
      {
        title: 'Send Money',
        path: 'send-money',
        element: <CreateTransaction />,
        accessRoles: ['accountant'],
      },
      {
        title: 'Transaction History',
        path: 'history',
        element: <TransactionList />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
      {
        title: 'Verify Transactions',
        path: 'verify-id',
        element: <VerifyTransactionByID />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
      {
        title: 'Approval Requests',
        path: 'approval-requests',
        element: <ApprovalRequestsList />,
        accessRoles: ['accountant', 'approver'],
      },
    ],
  },

  {
    title: 'Scheduled Payment',
    path: 'scheduled-payment',
    icon: <RiCalendarScheduleLine />,
    element: <ScheduledPayment />,
    accessRoles: ['accountant', 'approver', 'clerk'],
    children: [
      {
        title: 'Create Schedule',
        path: 'create',
        element: <CreateScheduled />,
        accessRoles: ['accountant'],
      },
      {
        title: 'Scheduled List',
        path: 'list',
        element: <ScheduledList />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
      {
        title: 'Bulk Report',
        path: 'bulk-report',
        element: <ScheduleReport />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
      {
        title: 'Approval Requests',
        path: 'approval-requests',
        element: <ScheduleApprovalRequestsList />,
        accessRoles: ['accountant', 'approver'],
      },
    ],
  },

  {
    title: 'Other Banks',
    path: 'transfer',
    icon: <RiBankFill />,
    element: <Transfer />,
    accessRoles: ['accountant', 'approver', 'clerk'],
    children: [
      {
        title: 'Send Money',
        path: 'send-money',
        element: <CreateTransfer />,
        accessRoles: ['accountant'],
      },
      {
        title: 'Transfer History',
        path: 'history',
        element: <TransferList />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
      {
        title: 'Transfer Fee',
        path: 'transfer-fee',
        element: <TransferFee />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
      {
        title: 'Account Lookup',
        path: 'account-lookup',
        element: <ExternalAccountLookup />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
      {
        title: 'Approval Requests',
        path: 'approval-requests',
        element: <BankTransferApprovalRequestsList />,
        accessRoles: ['accountant', 'approver'],
      },
    ],
  },

  {
    title: 'Bill Payment',
    path: 'bill',
    icon: <FaMoneyBillTrendUp />,
    element: <BillPayment />,
    accessRoles: ['accountant', 'approver', 'clerk'],
    children: [
      {
        title: 'Create Bill',
        path: 'create',
        element: <CreateBill />,
        accessRoles: ['accountant'],
      },
      {
        title: 'List Bills',
        path: 'list',
        element: <BillList />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
      {
        title: 'Update Bill',
        path: 'update',
        element: <UpdateBill />,
        accessRoles: ['accountant'],
      },
      {
        title: 'Check Bulk Status',
        path: 'bulkimport-list',
        element: <CheckBulkBillStatus />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
      {
        title: 'Create Payout Method',
        path: 'create-payout-methods',
        element: <CreatePayoutMethod />,
        accessRoles: ['accountant'],
      },
      {
        title: 'List Payout Methods',
        path: 'payout-methods-list',
        element: <ListPayoutMethods />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
    ],
  },

  {
    title: 'Recurring Contract',
    path: 'recurring-contract',
    icon: <MdOutlinePayments />,
    element: <RecurringContract />,
    accessRoles: ['accountant', 'approver', 'clerk'],
    children: [
      {
        title: 'Create Contract',
        path: 'create',
        element: <CreateContract />,
        accessRoles: ['accountant'],
      },
      {
        title: 'Contract List',
        path: 'list',
        element: <ContractList />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
      {
        title: 'Contract Report',
        path: 'report',
        element: <ContractReport />,
        accessRoles: ['accountant', 'approver', 'clerk'],
      },
      {
        title: 'Request Payment',
        path: 'request-payment',
        element: <RequestPayment />,
        accessRoles: ['accountant'],
      },
      {
        title: 'Request Payments Report',
        path: 'request-payment-report',
        element: <RequestPaymentReport />,
        accessRoles: ['accountant', 'approver', 'clerk'],
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
    title: 'Airtime/Package',
    path: 'airtime',
    icon: <MdSendToMobile />,
    element: <AirTime />,
    accessRoles: ['accountant'],
  },
  {
    title: 'Generate QR Code',
    path: 'qr-code',
    icon: <IoQrCode />,
    element: <GenerateQRCode />,
    accessRoles: ['accountant', 'approver', 'clerk'],
  },
  {
    title: 'User Guide',
    path: 'guide',
    element: <Guide />,
    icon: <MdOutlineContactSupport />,
    accessRoles: ['accountant', 'approver', 'clerk'],
  },
  {
    title: 'Support',
    path: 'support',
    element: <Support />,
    icon: <HiOutlineSupport />,
    accessRoles: ['accountant', 'approver', 'clerk'],
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
      { path: 'login', element: <Navigate to="/" replace={true} /> },
      { path: '*', element: <NotFound /> },
      { path: 'account', element: <UserAccount /> },
      { path: 'account/change-password', element: <ChangePassword /> },
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
