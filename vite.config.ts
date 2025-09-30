/*
* To buid an esmodule: 
*
*     BUILD_LIB=true vite build
*
* Or for the usual PWA, just
* 
* vitei build
*/
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';
import packageJson from './package.json';

const homepage = packageJson.homepage || '/';
const base = homepage ? (new URL(homepage)).pathname.replace(/\/?$/, '/') : '/';

const isLib = process.env.BUILD_LIB === 'true';

console.info('# Base: ', base);
console.info('# Building as lib?', isLib);

// https://vitejs.dev/config/
export default defineConfig({
  base: isLib ? './' : base,

  build: isLib
    ? {
      lib: {
        entry: 'src/lib/index.ts',
        name: 'LearningCards',
        fileName: (format) => `learning-cards.${format}.js`,
        formats: ['es'],
      },
      target: 'esnext',
      rollupOptions: {
        // externalize dependencies that shouldn't be bundled
        external: ['solid-js'],
        output: {
          globals: {
            'solid-js': 'Solid',
          },
        },
      },
    }
    : {
      target: 'esnext',
    },

  resolve: {
    conditions: ['development', 'browser'],
  },

  plugins: isLib
    ? [solidPlugin()] // just build Solid module
    : [
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
          icons: [
            { src: base + 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: base + 'icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          ],
        },
        workbox: { /* ... */ },
      }),
    ],
});
