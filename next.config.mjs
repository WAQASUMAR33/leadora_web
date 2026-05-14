/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'data.tascpa.ca',
      },
      {
        protocol: 'https',
        hostname: 'rapidtechpro.com',
      },
      {
        protocol: 'https',
        hostname: 'data.store2u.ca',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    unoptimized: true,
    dangerouslyAllowSVG: false,
  },

  // Compression
  compress: true,

  // Production optimizations
  // Disabled optimizeCss as it requires 'critters' package and can cause build issues
  // experimental: {
  //   optimizeCss: true,
  // },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
      // Do not tell CDNs to cache product catalog (admin uses ?showInactive=true; stale JSON/HTML breaks the UI).
      {
        source: '/api/products',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/api/products/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Avoid CDN/browser caching HTML for admin after deploys; stale HTML still
      // references old hashed chunks under /_next/static and causes ChunkLoadError 404s.
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

};

export default nextConfig;
