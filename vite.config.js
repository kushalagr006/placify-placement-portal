import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/student': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/company': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
});
