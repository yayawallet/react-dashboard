import { Navigate } from 'react-router-dom';

import AirTime from '../pages/AirTime/IndexPage';
import BuyAirTime from '../pages/AirTime/Index';
import AirtimeApprovalList from '../pages/AirTime/AirtimeApprovalList';

import Transaction from '../pages/Transaction/Index';
import CreateTransaction from '../pages/Transaction/CreateTransaction';
import TransactionList from '../pages/Transaction/TransactionList';
import VerifyTransactionByID from '../pages/Transaction/VerifyTransactionID';
import GenerateQRCode from '../pages/GenerateQRCode';
import TransactionApprovalList from '../pages/Transaction/TransactionApprovalList';

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
import PhoneNumber from '../pages/RegisterUsers/PhoneNumber';
import NationalID from '../pages/RegisterUsers/NationalID';

import ScheduledPayment from '../pages/ScheduledPayment/Index';
import CreateScheduled from '../pages/ScheduledPayment/CreateScheduledPayment';
import ScheduledList from '../pages/ScheduledPayment/ScheduledList';
import ScheduledReport from '../pages/ScheduledPayment/ScheduledBulkReport';
import ScheduledApprovalList from '../pages/ScheduledPayment/ScheduledApprovalList';
import ScheduledBulkApprovalList from '../pages/ScheduledPayment/ScheduledBulkApprovalList';

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
import BankTransferApprovalList from '../pages/BankTransfer/BankTransferApprovalList';

import BulkImportReportDetails from '../components/BulkImportReportDetails';

import UserAccount from '../pages/UserSettings/UserAccount';
import ChangePassword from '../pages/UserSettings/ChangePassword';

import Support from '../pages/Support';
import Guide from '../pages/Guide';
import HelpCenter from '../pages/HelpCenter';

import NoRoleAssigned from '../pages/ErrorPage/NoRoleAssigned';

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
import ScheduledBulkDisplay from '../components/ScheduledBulkDisplay';

export const sidebarNavs = [
  {
    title: 'Transaction',
    path: 'transaction',
    icon: <BiTransferAlt />,
    element: <Transaction />,
    accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
    children: [
      {
        title: 'Send Money',
        path: 'send-money',
        element: <CreateTransaction />,
        accessRoles: ['accountant', 'agent'],
      },
      {
        title: 'Transaction History',
        path: 'history',
        element: <TransactionList />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
      {
        title: 'Verify Transactions',
        path: 'verify-id',
        element: <VerifyTransactionByID />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
      {
        title: 'Approval Requests',
        path: 'approval-requests',
        element: <TransactionApprovalList />,
        accessRoles: ['accountant', 'agent', 'approver'],
      },
    ],
  },

  {
    title: 'Other Banks',
    path: 'transfer',
    icon: <RiBankFill />,
    element: <Transfer />,
    accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
    children: [
      {
        title: 'Send Money',
        path: 'send-money',
        element: <CreateTransfer />,
        accessRoles: ['accountant', 'agent'],
      },
      {
        title: 'Transfer History',
        path: 'history',
        element: <TransferList />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
      {
        title: 'Transfer Fee',
        path: 'transfer-fee',
        element: <TransferFee />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
      {
        title: 'Account Lookup',
        path: 'account-lookup',
        element: <ExternalAccountLookup />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
      {
        title: 'Approval Requests',
        path: 'approval-requests',
        element: <BankTransferApprovalList />,
        accessRoles: ['accountant', 'agent', 'approver'],
      },
    ],
  },

  {
    title: 'Scheduled Payment',
    path: 'scheduled-payment',
    icon: <RiCalendarScheduleLine />,
    element: <ScheduledPayment />,
    accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
    children: [
      {
        title: 'Create Schedule',
        path: 'create',
        element: <CreateScheduled />,
        accessRoles: ['accountant', 'agent'],
      },
      {
        title: 'Scheduled List',
        path: 'list',
        element: <ScheduledList />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
      {
        title: 'Bulk Report',
        path: 'bulk-report',
        element: <ScheduledReport />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
      {
        title: 'Approval Requests',
        path: 'approval-requests',
        element: <ScheduledApprovalList />,
        accessRoles: ['accountant', 'agent', 'approver'],
      },
      {
        title: 'Bulk Approval Requests',
        path: 'bulk-approval-requests',
        element: <ScheduledBulkApprovalList />,
        accessRoles: ['accountant', 'agent', 'approver'],
      },
    ],
  },

  {
    title: 'Bill Payment',
    path: 'bill',
    icon: <FaMoneyBillTrendUp />,
    element: <BillPayment />,
    accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
    children: [
      {
        title: 'Create Bill',
        path: 'create',
        element: <CreateBill />,
        accessRoles: ['accountant', 'agent'],
      },
      {
        title: 'List Bills',
        path: 'list',
        element: <BillList />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
      {
        title: 'Update Bill',
        path: 'update',
        element: <UpdateBill />,
        accessRoles: ['accountant', 'agent'],
      },
      {
        title: 'Check Bulk Status',
        path: 'bulkimport-list',
        element: <CheckBulkBillStatus />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
      {
        title: 'Create Payout Method',
        path: 'create-payout-methods',
        element: <CreatePayoutMethod />,
        accessRoles: ['accountant', 'agent'],
      },
      {
        title: 'List Payout Methods',
        path: 'payout-methods-list',
        element: <ListPayoutMethods />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
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
        title: 'Phone Number',
        path: 'phone-number',
        element: <PhoneNumber />,
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
    accessRoles: ['accountant', 'agent', 'approver'],
    children: [
      {
        title: 'Airtime/Package',
        path: 'buy',
        element: <BuyAirTime />,
        accessRoles: ['accountant', 'agent'],
      },
      {
        title: 'Approval Requests',
        path: 'approval-requests',
        element: <AirtimeApprovalList />,
        accessRoles: ['accountant', 'agent', 'approver'],
      },
    ],
  },

  {
    title: 'Recurring Contract',
    path: 'recurring-contract',
    icon: <MdOutlinePayments />,
    element: <RecurringContract />,
    accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
    children: [
      {
        title: 'Create Contract',
        path: 'create',
        element: <CreateContract />,
        accessRoles: ['accountant', 'agent'],
      },
      {
        title: 'Contract List',
        path: 'list',
        element: <ContractList />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
      {
        title: 'Contract Report',
        path: 'report',
        element: <ContractReport />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
      {
        title: 'Request Payment',
        path: 'request-payment',
        element: <RequestPayment />,
        accessRoles: ['accountant', 'agent'],
      },
      {
        title: 'Request Payments Report',
        path: 'request-payment-report',
        element: <RequestPaymentReport />,
        accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
      },
    ],
  },

  {
    title: 'Generate QR Code',
    path: 'qr-code',
    icon: <IoQrCode />,
    element: <GenerateQRCode />,
    accessRoles: ['accountant', 'agent'],
  },

  {
    title: 'User Guide',
    path: 'guide',
    element: <Guide />,
    icon: <MdOutlineContactSupport />,
    accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
  },

  {
    title: 'Support',
    path: 'support',
    element: <Support />,
    icon: <HiOutlineSupport />,
    accessRoles: ['accountant', 'agent', 'approver', 'clerk'],
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
      {
        path: '/scheduled-payment/bulk-approval-requests/json-display',
        element: <ScheduledBulkDisplay />,
      },
      { path: 'bill/update/:bill_id', element: <UpdateBill /> },
      { path: '', element: <Home /> },
      { path: 'profile', element: <Profile /> },
      { path: 'login', element: <Navigate to="/" replace={true} /> },
      { path: '*', element: <NotFound /> },
      { path: 'account', element: <UserAccount /> },
      { path: 'account/change-password', element: <ChangePassword /> },
      { path: 'no-role-assigned', element: <NoRoleAssigned /> },
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
      { path: '*', element: <Navigate to="/login" replace={true} /> },
    ],
  },
];
