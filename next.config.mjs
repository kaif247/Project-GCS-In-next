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
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();
      for (const key of Object.keys(entries)) {
        if (key.includes('admin backend')) {
          delete entries[key];
        }
      }
      return entries;
    };
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
