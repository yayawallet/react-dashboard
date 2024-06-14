import AirTime from '../pages/AirTime/Index';

import Transaction from '../pages/Transaction/Index';
import CreateTransaction from '../pages/Transaction/CreateTransaction';
import TransactionList from '../pages/Transaction/TransactionList';
import VerifyTransactionByID from '../pages/Transaction/VerifyTransactionID';
import GenerateQRCode from '../pages/GenerateQRCode';

import Transfer from '../pages/BankTransfer/Index';
import CreateTransfer from '../pages/BankTransfer/CreateTransfer';
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

import Support from '../pages/Support';
import Guide from '../pages/Guide';
import HelpCenter from '../pages/HelpCenter';
import AboutYaYa from '../pages/AboutYaYa';

// Non-menu navigations
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

const privateNavs = [
  { path: '/', element: <Home />, accessRoles: ['admin', 'clerk'] },
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
    title: 'Scheduled Payment',
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
        title: 'Contract Report',
        path: 'recurring-contract/report',
        element: <ReportContract />,
        accessRoles: ['admin', 'clerk'],
      },
      {
        title: 'Request Payment',
        path: 'recurring-contract/request-payment',
        element: <RequestPayment />,
        accessRoles: ['admin'],
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
      {
        title: 'Transfer Money',
        path: 'transfer/create',
        element: <CreateTransfer />,
        accessRoles: ['admin'],
      },
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
  { title: 'User Guide', path: 'guide', element: <Guide />, icon: <MdOutlineContactSupport /> },
  { title: 'Support', path: 'support', element: <Support />, icon: <HiOutlineSupport /> },
];

const publicNavs = [
  { path: '/login', element: <Login /> },
  { path: '/help-center', element: <HelpCenter /> }, // Header Menu
  { path: '/about-yaya', element: <AboutYaYa /> }, // Header Menu
  { path: '*', element: <NotFound /> },
];

const privateMenus = privateNavs.map((menu) => ({
  ...menu,
  isPrivate: true,
}));
const publicMenus = publicNavs.map((menu) => ({ ...menu, isPrivate: false }));

export const menus = [...privateMenus, ...publicMenus];
