/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_TRANSACTION_INVOICE_URL: string;
  readonly VITE_GET_TIME_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
