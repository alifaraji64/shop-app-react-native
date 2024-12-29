import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    serverActions:{
      bodySizeLimit:'3mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'egpmzfyxnhazxdnsnaam.supabase.co'
      },
    ],
  },
};

export default nextConfig;
