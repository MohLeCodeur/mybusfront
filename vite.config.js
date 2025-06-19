// vite.config.js (NOUVEAU CODE CORRIGÉ)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // La ligne "tailwindcss()" a été supprimée ici.
    // Avec la version 3 stable de Tailwind, la configuration se fait
    // automatiquement via votre fichier postcss.config.js.

    // On conserve votre configuration PWA qui est correcte
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Gestion Bus Mali',
        short_name: 'Mybus',
        description: 'Application de gestion de bus au Mali',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],

  // On conserve votre configuration d'alias de chemin
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Les sections "css" et "optimizeDeps" ont été supprimées car elles
  // ne sont plus nécessaires avec une configuration standard et peuvent
  // causer des conflits.
});