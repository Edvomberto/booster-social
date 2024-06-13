import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/booster-social/",
  server: {
    historyApiFallback: true, // Certifique-se de que o Vite lide com o roteamento de SPA
  },
  publicDir: 'public' // Adicione esta linha para garantir que os arquivos públicos sejam servidos
})
