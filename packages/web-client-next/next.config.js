/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled to prevent double rendering and Suspense hydration issues
  // swcMinify: true,
  
  // // Skip ESLint during build
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  
  // Handle SASS/SCSS
  sassOptions: {
    includePaths: ['./src'],
  },
  
  // Environment variables - note: prefix with NEXT_PUBLIC_ to expose to browser
  env: {
    GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',
  },
  
  // Image optimization - disabled for static export
  images: {
    unoptimized: true,
  },
  
  // Webpack config for SVG handling with SVGR
  webpack: (config, { isServer }) => {
    // Remove default SVG handling
    config.module.rules = config.module.rules.map((rule) => {
      if (rule.test?.toString().includes('svg')) {
        return {
          ...rule,
          exclude: /\.svg$/i,
        };
      }
      return rule;
    });

    // Add SVGR loader for SVGs with ?react query
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /react/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ],
            },
          },
        },
      ],
    });

    // Add file loader for SVGs without ?react query
    config.module.rules.push({
      test: /\.svg$/i,
      type: 'asset/resource',
    });

    return config;
  },

  // Use regular SSR instead of static export
  trailingSlash: true,

  // Enable standalone output for Docker builds
  output: 'standalone',
};

module.exports = nextConfig;
