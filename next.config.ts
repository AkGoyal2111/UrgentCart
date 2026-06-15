import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Type checking is done in CI/IDE — skip during build for faster deploys
    ignoreBuildErrors: true,
  },
  eslint: {
    // Linting is done separately — skip during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
