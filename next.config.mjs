/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Server Actions cap request bodies at 1 MB by default, which silently
    // blocks voice recordings and video uploads. Raise it so media can post.
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    remotePatterns: [
      {
        // Allow images served from any Supabase project's public storage
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
