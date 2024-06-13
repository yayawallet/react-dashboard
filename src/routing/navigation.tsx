import AirTime from '../pages/AirTime/Index';

import Transaction from '../pages/Transaction/Index';
import CreateTransaction from '../pages/Transaction/CreateTransaction';
import TransactionList from '../pages/Transaction/TransactionList';
import VerifyTransactionByID from '../pages/Transaction/VerifyTransactionID';
import GenerateQRCode from '../pages/GenerateQRCode';

import Transfer from '../pages/BankTransfer/Index';
import TransferList from '../pages/BankTransfer/TransferList';
import ExternalAccountLookup from '../pages/BankTransfer/ExternalAccountLookup';
import TransferFee from '../pages/BankTransfer/TransferFee';

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

// Non-menu navigations
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Login from '../pages/Authentication/Login';
import Logout from '../pages/Authentication/Logout';
import NotFound from '../pages/NotFound';

// Icons
import { MdSendToMobile } from 'react-icons/md';
import { BiTransferAlt } from 'react-icons/bi';
import { IoQrCode } from 'react-icons/io5';
import { RiCalendarScheduleLine } from 'react-icons/ri';
import { MdOutlinePayments } from 'react-icons/md';
import { MdOutlineHelpCenter } from 'react-icons/md';
import { RiBankFill } from 'react-icons/ri';

const privateNavs = [
  { path: '/', element: <Home />, accessRoles: ['admin', 'clerk'] }, // index
  { path: 'profile', element: <Profile />, accessRoles: ['admin', 'clerk'] },
  {
    title: 'Airtime/Package',
    path: 'airtime',
    icon: <MdSendToMobile />,
    element: <AirTime />,
    accessRoles: ['admin', 'clerk'],
  },
  {
    title: 'Transaction',
    path: 'transaction/',
    icon: <BiTransferAlt />,
    element: <Transaction />,
    accessRoles: ['admin', 'clerk'],
    submenuItems: [
      {
        title: 'Create Transaction',
        path: 'transaction/create',
        element: <CreateTransaction />,
        accessRoles: ['admin'],
      },
      {
        title: 'Transaction List',
        path: 'transaction/list',
        element: <TransactionList />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Verify Transaction',
        path: 'transaction/verify-id',
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
    title: 'Scheduled Payment/',
    path: 'scheduled-payment',
    icon: <RiCalendarScheduleLine />,
    element: <ScheduledPayment />,
    accessRoles: ['admin', 'clerk'],
    submenuItems: [
      {
        title: 'Create Schedule',
        path: 'scheduled-payment/create',
        element: <CreateScheduled />,
        accessRoles: ['admin'],
      },
      {
        title: 'Scheduled List',
        path: 'scheduled-payment/list',
        element: <ListScheduled />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Scheduled Report',
        path: 'scheduled-payment/report',
        element: <ReportSchedule />,
        accessRoles: ['admin', 'clerk'],
      },
    ],
  },
  {
    title: 'Recurring Contract',
    path: 'recurring-contract/',
    icon: <MdOutlinePayments />,
    element: <RecurringContract />,
    accessRoles: ['admin', 'clerk'],
    submenuItems: [
      {
        title: 'Create Contract',
        path: 'recurring-contract/create',
        element: <CreateContract />,
        accessRoles: ['admin'],
      },
      {
        title: 'Contract List',
        path: 'recurring-contract/list',
        element: <ContractList />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Request Payment',
        path: 'recurring-contract/request-payment',
        element: <RequestPayment />,
        accessRoles: ['admin'],
      },
      {
        title: 'Contract Report',
        path: 'recurring-contract/report',
        element: <ReportContract />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Request Payments Report',
        path: 'recurring-contract/request-payment/report',
        element: <ReportRequestPayment />,
        accessRoles: ['admin', 'clerk'],
      },
    ],
  },
  {
    title: 'Other Banks',
    path: 'transfer/',
    icon: <RiBankFill />,
    element: <Transfer />,
    accessRoles: ['admin', 'clerk'],
    submenuItems: [
      { title: 'Transfer Money', path: 'transfer/create', accessRoles: ['admin'] },
      {
        title: 'Transfer List',
        path: 'transfer/list',
        element: <TransferList />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Check Fee',
        path: 'transfer/check-fee',
        element: <TransferFee />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Account Lookup',
        path: 'transfer/account-lookup',
        element: <ExternalAccountLookup />,
        accessRoles: ['admin', 'clerk'],
      },
    ],
  },
];

const publicNavs = [
  { path: '/login', element: <Login /> },
  { path: '/logout', element: <Logout /> },
  { title: 'Help Center', path: 'help-center', icon: <MdOutlineHelpCenter /> },
  { path: '*', element: <NotFound /> },
];

const privateMenus = privateNavs.map((menu) => ({
  ...menu,
  isPrivate: true,
}));
const publicMenus = publicNavs.map((menu) => ({ ...menu, isPrivate: false }));

export const menus = [...privateMenus, ...publicMenus];
