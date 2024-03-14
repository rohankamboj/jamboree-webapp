import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [basicSsl(), tsconfigPaths(), react()],
  server: { https: true },
  resolve: {
    alias: {
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision'),
    },
  },
})
