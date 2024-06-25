import { Navigate } from 'react-router-dom';

import AirTime from '../pages/AirTime/Index';

import Transaction from '../pages/Transaction/Index';
import CreateTransaction from '../pages/Transaction/CreateTransaction';
import TransactionList from '../pages/Transaction/TransactionList';
import VerifyTransactionByID from '../pages/Transaction/VerifyTransactionID';
import GenerateQRCode from '../pages/GenerateQRCode';

import ScheduledPayment from '../pages/ScheduledPayment/Index';
import CreateScheduled from '../pages/ScheduledPayment/Create';
import ListScheduled from '../pages/ScheduledPayment/List';
import ReportSchedule from '../pages/ScheduledPayment/Report';

import RecurringContract from '../pages/RecurringContract/Index';
import CreateContract from '../pages/RecurringContract/CreateContract';
import ContractList from '../pages/RecurringContract/ContractList';
import RequestPayment from '../pages/RecurringContract/RequestPayment';
import ReportContract from '../pages/RecurringContract/ReportContract';
import ReportRequestPayment from '../pages/RecurringContract/ReportRequestPayment';

import Transfer from '../pages/BankTransfer/Index';
import CreateTransfer from '../pages/BankTransfer/CreateTransfer';
import TransferList from '../pages/BankTransfer/TransferList';
import ExternalAccountLookup from '../pages/BankTransfer/ExternalAccountLookup';
import TransferFee from '../pages/BankTransfer/TransferFee';

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

export const sidebarNavs = [
  {
    title: 'Airtime/Package',
    path: 'airtime',
    icon: <MdSendToMobile />,
    element: <AirTime />,
    accessRoles: ['admin', 'clerk'],
  },
  {
    title: 'Transaction',
    path: 'transaction',
    icon: <BiTransferAlt />,
    element: <Transaction />,
    accessRoles: ['admin', 'clerk'],
    children: [
      {
        title: 'Create Transaction',
        path: 'create',
        element: <CreateTransaction />,
        accessRoles: ['admin'],
      },
      {
        title: 'Transaction List',
        path: 'list',
        element: <TransactionList />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Verify Transaction',
        path: 'verify-id',
        element: <VerifyTransactionByID />,
        accessRoles: ['admin', 'clerk'],
      },
    ],
  },
  {
    title: 'Generate QR Code',
    path: 'qr-code',
    icon: <IoQrCode />,
    element: <GenerateQRCode />,
    accessRoles: ['admin', 'clerk'],
  },
  {
    title: 'Scheduled Payment',
    path: 'scheduled-payment',
    icon: <RiCalendarScheduleLine />,
    element: <ScheduledPayment />,
    accessRoles: ['admin', 'clerk'],
    children: [
      {
        title: 'Create Schedule',
        path: 'create',
        element: <CreateScheduled />,
        accessRoles: ['admin'],
      },
      {
        title: 'Scheduled List',
        path: 'list',
        element: <ListScheduled />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Scheduled Report',
        path: 'report',
        element: <ReportSchedule />,
        accessRoles: ['admin', 'clerk'],
      },
    ],
  },
  {
    title: 'Recurring Contract',
    path: 'recurring-contract',
    icon: <MdOutlinePayments />,
    element: <RecurringContract />,
    accessRoles: ['admin', 'clerk'],
    children: [
      {
        title: 'Create Contract',
        path: 'create',
        element: <CreateContract />,
        accessRoles: ['admin'],
      },
      {
        title: 'Contract List',
        path: 'list',
        element: <ContractList />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Contract Report',
        path: 'report',
        element: <ReportContract />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Request Payment',
        path: 'request-payment',
        element: <RequestPayment />,
        accessRoles: ['admin'],
      },
      {
        title: 'Request Payments Report',
        path: 'request-payment/report',
        element: <ReportRequestPayment />,
        accessRoles: ['admin', 'clerk'],
      },
    ],
  },
  {
    title: 'Other Banks',
    path: 'transfer',
    icon: <RiBankFill />,
    element: <Transfer />,
    accessRoles: ['admin', 'clerk'],
    children: [
      {
        title: 'Transfer Money',
        path: 'create',
        element: <CreateTransfer />,
        accessRoles: ['admin'],
      },
      {
        title: 'Transfer List',
        path: 'list',
        element: <TransferList />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Check Fee',
        path: 'check-fee',
        element: <TransferFee />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Account Lookup',
        path: 'account-lookup',
        element: <ExternalAccountLookup />,
        accessRoles: ['admin', 'clerk'],
      },
    ],
  },
  {
    title: 'User Guide',
    path: 'guide',
    element: <Guide />,
    icon: <MdOutlineContactSupport />,
    accessRoles: ['admin', 'clerk'],
  },
  {
    title: 'Support',
    path: 'support',
    element: <Support />,
    icon: <HiOutlineSupport />,
    accessRoles: ['admin', 'clerk'],
  },
];

export const privateNavs = [
  {
    path: '',
    element: <Layout />,
    children: [
      ...sidebarNavs,
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
