declare module '*.svg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';
declare module '*.xlsx';

interface Window {
  env: {
    BASE_URL: string;
    TRANSACTION_INVOICE_URL: string;
    GET_TIME_URL: {
      time: number;
    };
  };
}
