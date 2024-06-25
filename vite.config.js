// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/booster-social/', // Configurar a base URL
  server: {
    historyApiFallback: true, // Certifique-se de que o Vite lide com o roteamento de SPA
  },
  publicDir: 'public', // Garantir que os arquivos públicos sejam servidos
  define: {
    'process.env': {},
  },
});
