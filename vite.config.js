import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'KanoonSaathi — India\'s Legal Companion',
        short_name: 'KanoonSaathi',
        description: 'India\'s AI-powered legal companion — Know Your Rights, Speak the Law. Free legal knowledge for every Indian citizen in 23 languages.',
        start_url: '/',
        display: 'standalone',
        background_color: '#07070F',
        theme_color: '#FF6B00',
        orientation: 'portrait-primary',
        categories: ['education', 'utilities'],
        lang: 'en-IN',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
        screenshots: [],
        shortcuts: [
          {
            name: 'Ask Legal Question',
            short_name: 'Ask AI',
            description: 'Ask a free legal question to KanoonSaathi AI',
            url: '/?action=chat',
            icons: [{ src: 'icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'Document Analyzer',
            short_name: 'Analyze',
            description: 'Upload and analyze any legal document',
            url: '/?action=analyzer',
            icons: [{ src: 'icon-192.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        // Precache all built assets (JS, CSS, HTML, SVG, fonts)
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],

        // Runtime caching strategies
        runtimeCaching: [
          {
            // Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 year
            },
          },
          {
            // Google Fonts files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // API calls — network first, fallback to cache for offline
            urlPattern: /^\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }, // 24 hours
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],

        // Navigate fallback for SPA
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
      },
      devOptions: {
        enabled: false, // Set to true to test SW in dev mode
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
