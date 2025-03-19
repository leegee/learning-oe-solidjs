import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import packageJson from './package.json';

const homepage = packageJson.homepage || '/';
const base = homepage ? (new URL(homepage)).pathname.replace(/\/?$/, '/') : '/';

console.info(['='.repeat(30), 'Base: ' + base, "=".repeat(30)].join("\n"))

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        start_url: 'https://leegee.github.io' + base,
        name: 'Learn Old English',
        short_name: 'Old English',
        description: 'Old English Learning',
        orientation: "portrait",
        theme_color: '#000033',
        scope: base,
        icons: [
          {
            src: base + 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: base + 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: base + 'icons/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: base + "icons/apple-touch-icon-180x180.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: base + "icons/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any"
          }
        ],
      },

      pwaAssets: {
        image: 'public/icons/dog.webp'
      },


      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === location.origin && url.pathname.endsWith('.html'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              networkTimeoutSeconds: 10,
              plugins: [],
            },
          },
          {
            urlPattern: ({ url }) => url.origin === location.origin && url.pathname.endsWith('.css'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'css-cache',
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: ({ url }) => url.origin === location.origin && url.pathname.endsWith('.js'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'js-cache',
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: ({ url }) => url.origin === location.origin && url.pathname.endsWith('.tff'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tff-cache',
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
});