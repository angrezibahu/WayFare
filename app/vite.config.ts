import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'node:path';

// Allow importing from ../content/ so the PWA's chapter files live next to
// the paper book's source, not duplicated under /app.
const root = resolve(__dirname);
const contentDir = resolve(__dirname, '..', 'content');

export default defineConfig({
  root,
  // Relative base so the built bundle works whether it's served from the root
  // or from a subpath like /wayfare/ (GitHub Pages, Cloudflare Pages, etc).
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png,woff2}'],
      },
      manifest: {
        name: 'WayFare',
        short_name: 'WayFare',
        description: 'A family apprenticeship in finding your way — by sky, by land, by story.',
        theme_color: '#f5efe3',
        background_color: '#f5efe3',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@content': contentDir,
    },
  },
  server: {
    fs: {
      // Allow loading chapter markdown from ../content/
      allow: [root, contentDir],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
