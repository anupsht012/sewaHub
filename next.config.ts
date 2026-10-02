import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false, // small speed win + security
  reactStrictMode: true,

  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days - images cache longer = faster reload
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "sonner",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-avatar",
    ],
    // Makes router cache stay longer = instant back navigation
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  // Cache static assets for 1 year
  async headers() {
    return [
      {
        source: "/(.*)\\.(js|css|woff2|avif|webp|png|jpg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;