/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from "next";
import withPWAPlugin from "next-pwa";

const withPWA = withPWAPlugin({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      // API — Network First
      urlPattern: /^https?:\/\/.*\/api\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutos
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      // Imagens externas — Cache First
      urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|webp|svg|gif)/,
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
        },
      },
    },
    {
      // Assets estáticos do Next.js — Cache First
      urlPattern: /\/_next\/static\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-cache",
        expiration: {
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 ano
        },
      },
    },
    {
      // Páginas — Stale While Revalidate
      urlPattern: /^https?:\/\/[^/]+\/(?!api).*/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "pages-cache",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60, // 24 horas
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig as any);
