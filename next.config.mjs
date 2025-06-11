/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@ai-sdk/openai'],
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone'
}

export default nextConfig
