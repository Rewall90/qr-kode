import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: 'https://qrgen.no',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
