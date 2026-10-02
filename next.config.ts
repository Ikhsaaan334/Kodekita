import type { NextConfig } from "next";

import path from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  eslint: { ignoreDuringBuilds: true },
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
};

export default nextConfig;
