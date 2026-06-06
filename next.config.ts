import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net", pathname: "/**" },
      { protocol: "https", hostname: "cdn.simpleicons.org", pathname: "/**" },
      { protocol: "https", hostname: "huggingface.co", pathname: "/**" },
    ],
  },
  async redirects() {
    return [
      { source: "/github", destination: "https://github.com/HAR5HA-7663", permanent: false },
      { source: "/linkedin", destination: "https://www.linkedin.com/in/har5ha-7663", permanent: false },
      { source: "/cv", destination: "/Harsha_Yellela_SDE.pdf", permanent: false },
    ];
  },
};

export default nextConfig;
