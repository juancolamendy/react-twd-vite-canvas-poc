import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import "dotenv/config";

// https://vitejs.dev/config/
export default defineConfig({
  // server config
  server: {
    port: process.env.PORT || 3000,
  },
  preview: {
    port: process.env.PORT || 3000
  },
  
  // plugins
  plugins: [react()]
});
