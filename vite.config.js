import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// I refer to the Vite config docs: https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
