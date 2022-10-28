import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import "dotenv/config";

// https://vitejs.dev/config/
export default defineConfig({
  // server config
  server: {
    port: 3000,
  },
  preview: {
    port: 3000
  },
  
  // plugins
  plugins: [react()]
});
