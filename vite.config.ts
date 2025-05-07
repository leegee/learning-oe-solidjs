import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';
import packageJson from './package.json';

const homepage = packageJson.homepage || '/';
const base = homepage ? (new URL(homepage)).pathname.replace(/\/?$/, '/') : '/';

console.info('# Base: ', base);

// https://vitejs.dev/config/
export default defineConfig({
  base,

  build: {
    target: 'esnext',
  },
  resolve: {
    conditions: ['development', 'browser'],
  },

  plugins: [
    solidPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: "/learning-oe-solidjs/",
        start_url: 'https://leegee.github.io' + base,
        name: 'Learning Cards',
        short_name: 'Learning Cards',
        description: 'Learning Cards for Old English and more',
        display: "standalone",
        display_override: ["fullscreen", "minimal-ui"],
        orientation: "portrait",
        theme_color: '#0000ee',
        background_color: '#000033',
        scope: base,
        screenshots: [
          {
            src: "screenshots/screenshot-640x480.png",
            sizes: "640x480",
            form_factor: "narrow",
            type: "image/png"
          },
          {
            src: "screenshots/screenshot-640x480-2.png",
            sizes: "640x480",
            form_factor: "narrow",
            type: "image/png"
          },
          {
            src: "screenshots/screenshot-640x480-3.png",
            sizes: "640x480",
            form_factor: "narrow",
            type: "image/png"
          },

          {
            src: "screenshots/screenshot-1280x720.png",
            sizes: "1280x720",
            form_factor: "wide",
            type: "image/png"
          },
          {
            src: "screenshots/screenshot-1280x720-2.png",
            sizes: "1280x720",
            form_factor: "wide",
            type: "image/png"
          },
          {
            src: "screenshots/screenshot-1280x720-3.png",
            sizes: "1280x720",
            form_factor: "wide",
            type: "image/png"
          }

        ],
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
            sizes: "180x180",
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
            urlPattern: ({ url }) => url.origin === location.origin && url.pathname.endsWith('.json'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'json-cache',
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