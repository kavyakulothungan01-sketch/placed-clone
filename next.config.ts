import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your existing image configuration
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'play.google.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  
  // ADDED: The secret tunnel to bypass CORS
  async rewrites() {
    return [
      {
        source: '/api/chat',
        destination: 'http://127.0.0.1:5000/predict', // Secretly routes to your Python backend!
      },
    ];
  },
};

export default nextConfig;