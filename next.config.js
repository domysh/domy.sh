/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const deploy_domain = process.env.NEXTAUTH_URL?
            new URL(process.env.NEXTAUTH_URL).hostname:"localhost"

module.exports = {
  reactStrictMode: !isProd,
  images: {
    domains: [deploy_domain]
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' http://vitals.vercel-insights.com; connect-src 'self' http://vitals.vercel-insights.com;"
          }
        ],
      },
    ]
  },
}
