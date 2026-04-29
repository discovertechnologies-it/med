import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-maskable.svg'],
      manifest: false, // we ship our own manifest.webmanifest in public/
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/admin\//],
        runtimeCaching: [
          {
            // Self-hosted Inter font files
            urlPattern: /\/assets\/inter-.*\.woff2$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'med-fonts',
              expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            // App icons
            urlPattern: /\/icon.*\.svg$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'med-icons',
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Future API GETs — stale-while-revalidate so the UI stays fast
            urlPattern: ({ request, url }) =>
              request.method === 'GET' &&
              (url.pathname.startsWith('/api/medicines') ||
                url.pathname.startsWith('/api/categories')),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'med-catalog',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
