import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
  },
  env: {
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET || 'cozy_crochets_rasika_secure_admin_session_key_2026_salt_default_key',
  },
  // Ensure Netlify and Next.js App Router hybrid build compatibility
  output: process.env.NEXT_OUTPUT_STANDALONE === 'true' ? 'standalone' : undefined,
};

export default nextConfig;
