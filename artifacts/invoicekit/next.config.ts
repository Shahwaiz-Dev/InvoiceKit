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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.google.com https://*.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://*.googleusercontent.com https://*.polar.sh https://avatar.vercel.sh; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.google.com https://*.polar.sh; frame-src 'self' https://*.polar.sh; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
