/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  output: 'export',
  reactStrictMode: !isProd,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api', 'color-functions', 'import'],
    quietDeps: true,
  },
}
