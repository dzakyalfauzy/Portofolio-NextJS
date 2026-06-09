import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Portofolio-NextJS",
  images: {
    unoptimized: true,
  },
  turbopack: undefined,
};

export default nextConfig;
