import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // basePath dihapus karena sudah pakai custom domain
  // basePath: "/Portofolio-NextJS",
  images: {
    unoptimized: true,
  },
  turbopack: undefined,
};

export default nextConfig;
