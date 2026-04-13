import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Fruchtfolgefestival-App/',  // genau so wie dein Repo heißt auf GitHub
  plugins: [react()],
})


