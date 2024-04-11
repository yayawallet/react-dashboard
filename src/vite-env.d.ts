/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: VITE_BASE_URL;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
