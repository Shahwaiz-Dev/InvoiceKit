import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: ["@workspace/db"],
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [
        { module: /mongodb/ },
        { message: /Can't resolve 'aws4'/ },
      ];
    }
    return config;
  },
  // Allow Ngrok URLs in dev
  // @ts-ignore
  allowedDevOrigins: [
    'nonilluminatingly-masterless-khalilah.ngrok-free.dev',
    'localhost:3000'
  ],
};

export default nextConfig;
