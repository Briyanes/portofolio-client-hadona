/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'hadona.id',
      },
      {
        protocol: 'https',
        hostname: 'portofolio.hadona.id',
      },
      {
        protocol: 'https',
        hostname: '**.hadona.id',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    unoptimized: false
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://connect.facebook.net https://www.googletagmanager.com https://www.facebook.com https://static.cloudflareinsights.com https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "img-src 'self' data: https: blob: https://*.supabase.co https://portofolio.hadona.id https://hadona.id https://*.hadona.id https://*.vercel.app https://cdn.jsdelivr.net https://*.fbcdn.net https://www.facebook.com",
              "font-src 'self' https://cdn.jsdelivr.net data:",
              "connect-src 'self' https://*.supabase.co https://supabase.co https://portofolio.hadona.id https://hadona.id https://*.hadona.id https://*.vercel.app wss://*.supabase.co wss://supabase.co https://www.facebook.com https://www.google-analytics.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
