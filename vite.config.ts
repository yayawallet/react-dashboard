import { defineConfig } from 'vite';
import { config } from 'dotenv';
import react from '@vitejs/plugin-react';

// Load environment variables from .env file
config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 3000,
  },
  assetsInclude: ['**/*.xlsx'],
  define: {
    'process.env': process.env,
  },
});
