import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: ["@workspace/db"],
  turbopack: {},
  serverExternalPackages: ["mongodb"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        dns: false,
        fs: false,
        child_process: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
      };
    }

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
