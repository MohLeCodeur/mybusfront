import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Gestion Bus Mali',
        short_name: 'Mybus',
        description: 'Application de gestion de bus au Mali',
        theme_color: '#0f172a', // bleu foncé ou couleur de ton branding
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  css: {
    postcss: {
      config: false
    }
  },
  optimizeDeps: {
    exclude: [
      'swiper/css',
      'swiper/css/navigation',
      'swiper/css/pagination',
      'leaflet/dist/leaflet.css'
    ]
  }
});
