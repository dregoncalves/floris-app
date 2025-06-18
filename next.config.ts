import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Captura todas as rotas que começam com /api
        destination: "http://localhost:8080/:path*", // Encaminha para o backend
      },
    ];
  },
};

export default nextConfig;
