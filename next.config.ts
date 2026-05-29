import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cy-directus.onrender.com",
        port: "",
        pathname: "/assets/**",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
