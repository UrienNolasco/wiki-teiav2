import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ], // ← Adicione isso
  },
  typescript: {
    ignoreBuildErrors: true, // Temporário (remova depois que resolver)
  },
};

export default nextConfig;
