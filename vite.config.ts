import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5100
  },
  preview: {
    cors: true,
    host: '0.0.0.0',
    port: 3000
  }
});

