import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.imgur.com'], // ← Adicione isso
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "@next-auth/prisma-adapter",
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // Temporário (remova depois que resolver)
  },
};

export default nextConfig;
