import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // basePath dihapus karena sudah pakai custom domain
  // basePath: "/Portofolio-NextJS",
  images: {
    unoptimized: true,
  },
  turbopack: undefined,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "static/media/[name].[hash:8].[ext]",
        },
      },
    });
    return config;
  },
};

export default nextConfig;
