import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
export default defineConfig({
  root:fileURLToPath(new URL('.',import.meta.url)),
  server:{port:5173,strictPort:true,proxy:{'/api':{target:'http://127.0.0.1:3001',changeOrigin:false}}},
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Little by little — Tiếng Anh để dùng",
        short_name: "Little English",
        description: "Luyện nhớ, luyện nghe và hội thoại tiếng Anh mỗi ngày.",
        theme_color: "#285e46",
        background_color: "#f8f9f6",
        display: "standalone",
        start_url: "/",
        lang: "vi",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "index.html",
        navigateFallbackDenylist:[/^\/api\//],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      devOptions: { enabled: false },
    }),
  ],
  build: { sourcemap: false,outDir:'../dist',emptyOutDir:true },
});
