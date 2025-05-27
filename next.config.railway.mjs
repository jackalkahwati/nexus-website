/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['isomorphic-dompurify', 'handlebars'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        canvas: false,
        undici: false,
        dns: false,
        child_process: false,
        stream: false,
        http2: false,
        https: false,
        http: false,
        path: false,
        crypto: false,
        os: false,
        url: false,
        zlib: false,
        querystring: false,
      }
    }
    
    // Add aliases for component resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'components': require('path').resolve(__dirname, './components'),
      '@': require('path').resolve(__dirname, './')
    }
    
    return config
  },
  // Use base path for railway deployment
  basePath: '',
  // Allow CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  // Disable image optimization during development - enable for production
  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  // Output as standalone to work better with Docker
  output: 'standalone',
  // Set experimental options correctly
  experimental: {
    // Remove the serverActions property completely
  }
}

export default nextConfig 