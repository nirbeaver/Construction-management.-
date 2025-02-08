/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
  // Enable static optimization where possible
  poweredByHeader: false,
  compress: true,
  // Improve development performance
  webpack: (config, { dev, isServer }) => {
    // Optimize development builds
    if (dev) {
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "replicate.com",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.openai.com/:path*",
      },
    ];
  },
};

export default nextConfig;
