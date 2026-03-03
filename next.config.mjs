/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx'],
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/imperial-treasury',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/media/:path*',
        destination: 'http://localhost:8000/media/:path*',
      },
    ];
  },
  webpack(config, { dev }) {
    if (dev) {
      config.cache = false;
    }
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            exportType: 'named',
            namedExport: 'ReactComponent',
            svgo: false,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
