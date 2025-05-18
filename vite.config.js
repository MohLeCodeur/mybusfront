import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  css: {
    postcss: {
      config: false // Désactive la recherche automatique de PostCSS
    }
  }
})
optimizeDeps: {
  exclude: [
    'swiper/css',
    'swiper/css/navigation',
    'swiper/css/pagination',
    'leaflet/dist/leaflet.css'
  ]
}