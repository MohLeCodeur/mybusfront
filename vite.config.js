// vite.config.js (NOUVELLE VERSION FINALE)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// Importez directement les plugins PostCSS
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react(),
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

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ==============================================================
  // === DÉBUT DE LA SECTION CORRIGÉE : CONFIGURATION POSTCSS INTERNE ===
  // ==============================================================
  // En spécifiant la configuration ici, on s'assure que Vite
  // l'utilise et n'essaie pas de chercher un fichier externe.
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  // ==============================================================
  // === FIN DE LA SECTION CORRIGÉE
  // ==============================================================
});