import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/qr-kode/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});