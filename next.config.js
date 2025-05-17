/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  compiler: {
    // Don't use SWC - use Babel instead
    styledComponents: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  output: 'standalone',
  modularizeImports: {
    '@react-three/drei': {
      transform: '@react-three/drei/{{member}}',
    },
    '@react-three/fiber': {
      transform: '@react-three/fiber/{{member}}',
    },
    'three': {
      transform: 'three/{{member}}',
    },
    'framer-motion': {
      transform: 'framer-motion/{{member}}',
    },
  },
  webpack: (config, { isServer }) => {
    // Add canvas loader configuration
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000, // Reduced from 100000 to 10000 (10KB)
          name: '[name].[ext]',
        },
      },
    })

    // Handle canvas for node
    if (isServer) {
      config.externals = [...config.externals, 'canvas']
    }

    return config
  },
}

module.exports = nextConfig 