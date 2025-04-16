import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.aceternity.com', 'aceternity.com', 'images.unsplash.com'], // Add 'assets.aceternity.com'
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false }; // Avoids SSR errors for certain modules
    return config;
  },
};

export default nextConfig;