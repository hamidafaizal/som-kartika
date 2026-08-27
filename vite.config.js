import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'logo-192.png',
        'logo-512.png'
      ],

      manifest: {
        name: 'SOM — Kartika Accessories Ponorogo',

        short_name: 'SOM Kartika',

        description:
          'Aplikasi Stock Opname Kartika Accessories',

        theme_color: '#E51B23',

        background_color: '#FFFFFF',

        display: 'standalone',

        orientation: 'portrait',

        icons: [
          {
            src: 'logo-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});